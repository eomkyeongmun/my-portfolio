export interface TechStack {
  name: string;
  role: string;
  reason: string; // 핵심 원칙: "어떤 대안들이 있었고, 왜 이 기술을 선택했는가?"에 대한 답
}

export interface ProblemSolving {
  issue: string; // 맞닥뜨린 문제 상황
  analysis: string; // 문제 원인 파악 및 분석 과정
  solution: string; // 해결 방법 및 근거 (왜 이 방법으로 해결했는가)
  result: string; // 그로 인한 결과(성능 개선 수치 등 검증 가능한 데이터)
}

export interface Project {
  category: "backend" | "infrastructure" | "devops" | "ai";
  title: string;
  period: string; // 예: "2023.01 ~ 2023.06"
  overview: {
    description: string;
    role: string;
  };
  thumbnail?: string; // 홈 카드 썸네일 (없으면 architecture.diagram 사용)
  confidential?: boolean; // 사내 프로젝트 등 코드 비공개 여부 (GitHub 링크 대신 비공개 배지 노출)
  architecture: {
    diagram: string; // 이미지 경로
    description: string; // 시스템의 전체적인 동작 플로우 및 구성 요소 설명
    reasoning: string; // 설계 근거: "수많은 방식 중 왜 이런 아키텍처로 구성했는가?" (핵심 원칙)
  };
  techStack: TechStack[];
  problemSolving: ProblemSolving[];
  retrospective: {
    improvements: string; // 개선된 점 (얻은 가치)
    regrets: string; // 아쉬운 점 (일정/자원 등의 한계로 타협했던 부분)
    futureWork: string; // 향후 개선 방향
  };
  links: {
    github?: string;
    demo?: string;
    velog?: string;
    [key: string]: string | undefined;
  };
}

export const projects: Project[] = [
  {
    category: "backend",
    title: "CrossView",
    period: "2026.06 ~",
    overview: {
      description:
        "직무 전환을 준비하는 사람들이 서로의 이력서를 공유하고, 모의 면접을 연습하는 스터디 플랫폼입니다. 처음에는 '면접 스터디를 온라인으로 하면 편하겠다' 정도의 가벼운 출발이었는데, 실제로 배포하고 운영하면서 '개인 프로젝트를 지속적으로 돌리려면 비용을 어떻게 통제할 것인가'라는 전혀 다른 종류의 문제와 마주하게 됐습니다.",
      role: "프론트엔드(Next.js), 백엔드(Spring Boot), 인프라(Terraform), CI/CD(GitHub Actions)까지 전 과정을 단독으로 설계·구현·운영하고 있습니다. 기능 구현보다 '혼자서도 안정적으로 운영할 수 있는 구조'를 만드는 데 더 많은 시간을 쏟았고, 기능이 다 돈 뒤에는 코드를 처음부터 다시 읽으며 동시성·쿼리·트랜잭션 경계·스키마 관리처럼 '지금은 잘 도는데 조건이 바뀌면 무너지는' 지점을 찾아 하나씩 재현 테스트와 함께 고쳤습니다.",
    },
    architecture: {
      diagram: "/images/crossview_arch.svg",
      description:
        "EC2 위에 Docker Compose로 Spring Boot·PostgreSQL·Redis·Next.js를 묶어 운영하고, DB 백업은 Spring Batch로 매일 새벽 3시에 pg_dump → S3 업로드 → 로컬 정리 3단계로 자동화했습니다. 에러가 발생하면 Logback 커스텀 Appender가 잡아서 Bedrock Claude Haiku로 원인을 분석한 뒤 이메일·Slack으로 알림을 보냅니다.",
      reasoning:
        "처음에는 당연히 RDS를 쓰려고 했습니다. 그런데 견적을 내보니 db.t3.micro만 해도 월 15달러, 거기에 스토리지와 백업 비용까지 더하면 개인 프로젝트치고 부담이 컸습니다. '이 서비스가 RDS 수준의 가용성이 정말 필요한가?'를 스스로에게 물었고, 솔직히 사용자가 수십 명인 스터디 플랫폼에서 Multi-AZ 페일오버는 과했습니다. 그래서 EC2 안에 Docker PostgreSQL을 올리고, 데이터 유실 리스크는 S3 일일 백업으로 커버하기로 했습니다. RPO 24시간이라는 건 '최악의 경우 하루치 데이터를 잃을 수 있다'는 뜻인데, 이 서비스의 성격상 그 정도는 허용 가능한 트레이드오프라고 판단했습니다. 에러 알림도 처음에는 단순히 로그를 모아서 이메일로 보내려고 했는데, 새벽에 온 에러 메일을 읽으면서 '이게 심각한 건지 아닌 건지'를 매번 직접 판단하는 게 피곤했습니다. 그래서 Bedrock Claude를 끼워 넣었고, 비용을 통제하기 위해 가장 저렴한 Haiku 모델을 쓰되 컨텍스트를 최근 50줄로 제한하고, 같은 에러는 10분간 중복 발송하지 않도록 했습니다. 'AI를 쓰되 비용이 예측 불가능해지면 안 된다'는 원칙이었습니다.",
    },
    techStack: [
      {
        name: "Spring Boot / JPA / QueryDSL",
        role: "REST API, 도메인 로직, 동적 쿼리",
        reason:
          "15개 엔티티 간 관계가 복잡하고(그룹-멤버십-이력서-평가 등 다대다 관계가 많았습니다), 모집 게시판 필터링처럼 조건이 동적으로 바뀌는 쿼리가 많아서 QueryDSL로 타입 안전하게 작성하는 게 유지보수에 유리했습니다.",
      },
      {
        name: "Docker Compose + PostgreSQL",
        role: "애플리케이션 실행 환경 + 데이터 저장",
        reason:
          "RDS를 쓰면 편하지만 월 비용이 EC2 요금과 맞먹었습니다. 개인 프로젝트에서 관리형 DB의 자동 백업·페일오버가 정말 필요한지 따져보니, Docker PostgreSQL + S3 백업이면 충분했습니다. 관리 부담은 늘었지만 월 비용을 절반 이하로 줄였습니다.",
      },
      {
        name: "Spring Batch + S3",
        role: "일일 DB 백업 자동화",
        reason:
          "cron + 쉘 스크립트로도 할 수 있었지만, 백업 실패 시 재시도·알림·이력 추적이 필요했습니다. Spring Batch의 Job/Step 구조가 pg_dump → S3 업로드 → 로컬 정리 3단계를 명확하게 분리해줬고, JobParameters로 중복 실행 방지까지 얻었습니다.",
      },
      {
        name: "Bedrock Claude Haiku + Logback",
        role: "에러 자동 분석 및 알림",
        reason:
          "에러 로그를 그대로 메일로 받으면 '이게 긴급한 건지, 무시해도 되는 건지' 판단이 매번 필요했습니다. Haiku 모델로 원인 분석·심각도 판단을 자동화해 그 판단 자체를 대신하게 했고, 대신 컨텍스트 50줄 제한·10분 중복 쿨다운·async 스레드풀 3개 상한을 걸어 비용이 통제 밖으로 나가지 않게 했습니다.",
      },
      {
        name: "Terraform",
        role: "AWS 인프라 전체 IaC",
        reason:
          "EC2·S3·Security Group·CloudWatch 알람 등 리소스가 10개가 넘으니, 콘솔에서 하나씩 만들다 보면 '이 보안 그룹 규칙이 왜 열려 있지?'를 추적할 수 없었습니다. 코드로 정의하면 변경 이력이 남고, 필요하면 환경을 통째로 재현할 수 있습니다.",
      },
      {
        name: "Flyway",
        role: "DB 스키마 버전 관리",
        reason:
          "초기에는 ddl-auto=update로 스키마를 자동 반영했습니다. 개발 속도는 빨랐지만, 이 방식은 '지금 운영 DB가 어떤 상태인지'를 코드 어디에서도 알 수 없게 만듭니다. 컬럼을 지워도 반영되지 않고, 되돌릴 수도 없고, 리뷰할 대상도 남지 않습니다. Flyway로 옮기면서 스키마 변경을 코드 리뷰 대상인 SQL 파일로 만들고, JPA는 ddl-auto=validate로 '엔티티와 실제 스키마가 어긋나면 기동을 실패시키는' 역할만 맡겼습니다. 런타임에 '컬럼 없음' 오류가 나는 것보다 배포 시점에 실패하는 편이 훨씬 낫다고 판단했습니다.",
      },
    ],
    problemSolving: [
      {
        issue:
          "개인 프로젝트의 DB를 RDS로 운영하니 월 비용이 EC2와 맞먹어서, 지속적으로 운영하기 부담이 됐습니다.",
        analysis:
          "RDS db.t3.micro가 월 ~$15, 여기에 스토리지·백업 비용까지 더하면 EC2 t3.medium($30)과 비슷해졌습니다. 사용자 수십 명의 스터디 플랫폼에서 Multi-AZ 페일오버·자동 백업이 정말 필요한지 의문이 들었고, '필요한 수준의 안정성만 직접 구현하면 비용을 절반으로 줄일 수 있겠다'고 판단했습니다.",
        solution:
          "RDS를 제거하고 EC2 위 Docker PostgreSQL로 전환한 뒤, Spring Batch Job을 pg_dump → S3 업로드 → 로컬 정리 3단계 Step으로 나눴습니다. 순서를 이렇게 둔 이유가 있는데, S3 업로드가 실패했는데도 다음 Step인 로컬 정리가 그대로 실행되면 원본이 S3에도 로컬에도 없는 상태가 될 수 있습니다. 그래서 업로드 Step에서 실패하면 예외를 던져 Job이 거기서 멈추고 로컬 파일은 지워지지 않도록 했습니다. S3 버킷에는 30일 수명주기 정책을 걸어 백업 스토리지도 자동으로 정리됩니다.",
        result:
          "DB 관련 월 비용이 ~$15에서 S3 프리티어(5GB) 범위 안의 사실상 0에 가까운 수준으로 줄었고, RPO 24시간이라는 트레이드오프를 서비스 특성에 맞게 수용한 의사결정이었습니다.",
      },
      {
        issue:
          "새벽에 에러 알림 메일이 오면, 스택트레이스를 직접 읽고 심각도를 판단하는 과정이 반복돼서 피로감이 컸습니다.",
        analysis:
          "에러 로그를 그대로 전달하는 건 '알림'이지 '분석'이 아니었습니다. 혼자 운영하는 프로젝트에서 모든 에러를 매번 직접 분류하는 건 지속 가능하지 않았습니다. 다만 AI로 그 판단을 대신하게 하는 순간 '이걸 계속 켜둬도 되는가'라는 질문이 새로 생겼고, 자동화로 얻는 이점을 비용이 갉아먹으면 안 된다고 판단했습니다.",
        solution:
          "Logback 커스텀 Appender로 com.crossview 패키지의 ERROR 로그만 잡되, 알림 서비스 자체의 로그는 제외해 무한루프를 방지했습니다. 잡힌 에러는 @Async로 비동기 처리하면서 해시 기반 10분 쿨다운으로 중복을 걸러내고, Bedrock Haiku에 최근 50줄 컨텍스트와 함께 보내 원인·심각도·조치 방안을 받아 이메일·Slack으로 발송합니다. 스레드풀 상한 3개, 컨텍스트 50줄 제한으로 비용이 통제 밖으로 나가지 않게 못박아뒀습니다.",
        result:
          "메일 제목의 AI 분석 요약만 보고 '지금 봐야 하는 건지 아닌지'를 바로 판단할 수 있게 됐습니다. 다만 처음엔 서버 에러든 사용자 입력 실수 같은 클라이언트 쪽 문제든 전부 알림이 왔는데, 며칠 받아보니 노이즈가 많다는 걸 알게 돼 서버 버그만 알림이 가도록 필터를 한 번 더 좁히는 개선을 거쳤습니다.",
      },
      {
        issue:
          "그룹 정원이 6명인데 7명이 가입되는 상황이 논리적으로 가능하다는 걸 코드를 다시 읽다가 발견했습니다.",
        analysis:
          "참여 로직은 '정원을 확인한 뒤 멤버를 추가한다'는 순서였는데, 이 두 단계 사이에 다른 요청이 끼어들 수 있다는 걸 놓치고 있었습니다. 남은 자리가 1개일 때 두 요청이 동시에 도착하면 둘 다 '아직 여유 있음'을 확인하고 둘 다 저장합니다. 중복 가입은 unique(user_id, group_id) 제약이 막아주지만, '멤버 수 <= 정원'은 DB 제약으로 표현할 수 있는 종류의 조건이 아니어서 애플리케이션이 직접 보장해야 했습니다. 게다가 정원 판단을 JPA 컬렉션 크기(memberships.size())로 하고 있었는데, 영속성 컨텍스트에 올라온 컬렉션은 다른 트랜잭션이 방금 추가한 멤버를 반영하지 못하므로 애초에 판단 근거로 부적절했습니다. 재현 테스트를 먼저 작성해보니 정원 2명 그룹(그룹장 1명 있음)에 10명이 동시에 요청했을 때 10명 전원이 가입에 성공했습니다.",
        solution:
          "그룹 행에 쓰기 잠금(SELECT ... FOR UPDATE)을 걸어 같은 그룹의 참여 처리를 직렬화했습니다. 낙관적 락도 검토했지만 멤버십 INSERT는 그룹 행을 수정하지 않아 버전이 올라가지 않고, 잠금 범위가 그룹 단위라 서로 다른 그룹의 참여는 서로를 기다리지 않으므로 비관적 락이 적절하다고 판단했습니다. 정원 판단은 컬렉션 크기 대신 COUNT 쿼리 결과로 바꿨습니다. 중복 가입은 여전히 unique 제약을 최종 방어선으로 두되, saveAndFlush로 제약 위반을 서비스 안에서 즉시 잡아 도메인 예외로 번역했습니다. save만 쓰면 INSERT가 커밋 시점까지 미뤄져 예외가 서비스 밖에서 터지고, 그러면 사용자에게 500이 나갑니다. 혹시 놓치는 경로가 있을 경우를 대비해 GlobalExceptionHandler에도 DataIntegrityViolationException을 잡아 409로 변환하는 안전망을 추가했습니다. 모집 신청 승인 경로도 같은 경쟁 상태여서 동일하게 적용했습니다.",
        result:
          "동일한 재현 테스트에서 10명 중 1명만 성공하고 나머지는 정원 초과로 거절됐으며, 최종 인원은 정확히 2명이었습니다. 동일 사용자가 5번 동시에 요청해도 멤버십은 1건만 생기는 것도 함께 검증했습니다. 이 테스트가 실제로 회귀를 잡는지 확인하려고 잠금을 다시 제거해봤더니 곧바로 실패(기대 1, 실제 10)해서, 테스트가 형식적으로 통과하는 게 아니라는 것도 검증했습니다. 경쟁 상태는 모킹으로는 재현 자체가 불가능하고 롤백되는 트랜잭션 테스트로도 여러 트랜잭션을 동시에 띄울 수 없어서, 실제 DB와 실제 스레드를 쓰는 통합 테스트로 분리했습니다. 이 작업을 포함해 테스트는 총 50개가 통과했습니다.",
      },
      {
        issue:
          "모집글 목록 화면에서 '현재 인원'을 group.getMemberships().size()로 계산하고 있었는데, 이게 숫자 하나를 보여주려고 그 그룹의 멤버십 행 전체를 로딩하는 동작이라는 걸 뒤늦게 발견했습니다.",
        analysis:
          "화면엔 인원수 하나만 필요한데 컬렉션 전체가 영속성 컨텍스트에 올라오고 있었습니다. 상세 조회처럼 그룹이 하나뿐인 화면이면 COUNT 쿼리 한 번으로 끝나지만, 목록 조회는 페이지 안에 그룹이 여러 개라 그룹마다 COUNT를 따로 날리면 그 자체로 또 다른 N+1이 됩니다. 그래서 '단건 조회'와 '목록 조회'를 같은 방식으로 풀면 안 된다고 판단했습니다.",
        solution:
          "GroupMemberCount라는 projection 인터페이스(groupId, memberCount)를 만들고, 목록 조회에서는 페이지에 담긴 그룹 ID를 모아 IN + GROUP BY 쿼리 한 번으로 그룹별 멤버 수를 집계해 Map으로 매핑했습니다. 반대로 단건 조회는 그룹이 하나뿐이라 배치가 필요 없어서 단순 COUNT 쿼리를 그대로 썼습니다. 같은 문제라도 호출 맥락(단건/목록)에 따라 다른 해법을 쓴 것입니다.",
        result:
          "목록 조회 시 그룹 수와 무관하게 집계 쿼리가 1회로 고정됐습니다. 같은 작업에서 이 로직을 포함한 테스트를 24개에서 48개로 늘려 회귀를 검증했습니다.",
      },
      {
        issue:
          "운영 DB의 스키마를 ddl-auto=update로 관리하고 있어서, 지금 DB가 어떤 상태인지 코드로 알 수 없었습니다.",
        analysis:
          "엔티티를 고치면 Hibernate가 알아서 테이블을 바꿔주니 편했지만, 이 방식은 변경 이력이 남지 않고 되돌릴 수 없으며 리뷰할 대상도 없습니다. 컬럼 삭제나 타입 변경은 반영조차 되지 않아, 시간이 지나면 '엔티티가 정의한 스키마'와 '실제 DB'가 조용히 어긋나기 시작합니다. 그렇다고 이미 데이터가 들어 있는 운영 DB에 마이그레이션 도구를 도입하는 건 조심스러웠습니다. 잘못하면 첫 배포에서 기존 테이블을 다시 만들려다 실패하거나, 최악의 경우 데이터를 건드릴 수 있으니까요.",
        solution:
          "먼저 엔티티로부터 Hibernate가 실제로 생성하는 DDL을 추출해 그것을 V1 기준 스크립트로 삼았습니다. 손으로 쓰면 실제 스키마와 미묘하게 어긋날 수 있어서, 추측이 아니라 실제 산출물에서 시작한 것입니다. 그리고 baseline-on-migrate 옵션으로 '이미 테이블이 있는 DB는 V1을 실행하지 않고 V1 상태로 기록만' 하도록 해서, 운영 DB는 손대지 않고 V2(인덱스 추가)부터 적용되게 했습니다. 신규 DB(로컬·CI)는 V1부터 순서대로 실행되므로 환경 간 스키마가 같아집니다. 마지막으로 ddl-auto를 validate로 바꿔, 엔티티와 실제 스키마가 어긋나면 기동 시점에 실패하도록 했습니다.",
        result:
          "배포 전에 두 경로를 실제 PostgreSQL 16에 대해 각각 확인했습니다. 빈 DB에서는 V1·V2가 순서대로 적용됐고, 기존 스키마가 있는 DB에서는 V1이 baseline으로 기록만 되고 V2만 실행되면서 인덱스 17개가 추가됐습니다. 두 경우 모두 ddl-auto=validate를 통과했습니다. 스키마 변경이 이제 PR에서 리뷰되는 SQL 파일이 됐고, '지금 운영 DB 상태'를 Git 로그로 추적할 수 있게 됐습니다.",
      },
    ],
    retrospective: {
      improvements:
        "전반부에서 가장 많이 배운 건 '운영 비용과 안정성 사이의 균형'이었습니다. RDS를 빼는 판단, AI 비용을 통제하는 설계 — 전부 '이 서비스의 규모에 맞는 적정 수준이 어디인가'를 고민한 결과입니다. 후반부에는 관심사가 안쪽으로 옮겨갔습니다. 기능이 다 도는 상태에서 코드를 다시 읽으며 '이게 사용자가 몰리면 버티는 구조인가'를 따져봤고, 그때 나온 것이 정원 초과 경쟁 상태, 멤버 수를 세는 방식이 만드는 반복 쿼리, 이력이 남지 않는 스키마 관리였습니다. 전부 '지금 당장은 잘 도는데 조건이 바뀌면 무너지는' 종류였고, 이런 건 기능 테스트로는 절대 드러나지 않는다는 걸 배웠습니다. 그래서 문제마다 재현 테스트를 먼저 쓰고 고치는 순서를 지켰고, 특히 동시성 수정에서는 고친 뒤 일부러 다시 되돌려 테스트가 실패하는지 확인했습니다. 테스트가 통과하는 것보다 '틀렸을 때 실패하는지'가 더 중요하다는 걸 그때 실감했습니다.",
      regrets:
        "모니터링이 에러 알림에 치중되어 있고, 성능 메트릭(응답 시간, DB 쿼리 속도 등)에 대한 관측은 아직 부족합니다. Prometheus·Grafana를 붙이긴 했지만 대시보드가 시스템 지표 위주라, 정작 이번에 고친 N+1이나 잠금 대기 같은 문제를 지표로 감지하는 수준까지는 가지 못했습니다. 성능 개선도 쿼리 개수로만 검증했을 뿐 실제 부하를 걸어 응답 시간이 어떻게 달라지는지는 측정하지 못했습니다. 비관적 락도 지금 규모에서는 안전한 선택이지만, 인기 그룹에 요청이 몰릴 때 대기가 어떻게 쌓이는지는 아직 데이터로 확인하지 못했습니다.",
      futureWork:
        "k6로 부하 테스트 시나리오를 만들어 개선 전후를 응답 시간·처리량으로 측정하고, 잠금 대기 시간과 커넥션 풀 사용률을 Grafana 대시보드에 올릴 계획입니다. 백업은 복구 테스트를 자동화해 RPO 24시간이 실제로 지켜지는지 정기 검증하려 합니다. 코드 쪽에서는 도메인 이벤트를 알림 외 영역으로 넓혀, 그룹 삭제 시 자식 데이터를 서비스가 순서대로 지우는 지금 구조를 이벤트 기반으로 바꾸는 것을 검토하고 있습니다.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my_own",
      demo: "https://crossview.duckdns.org",
    },
  },
  {
    category: "ai",
    title: "자동차 사이버보안 RAG 시스템",
    period: "2026.03 ~ 2026.06",
    thumbnail: "/images/rag_arch.svg",
    confidential: true,
    overview: {
      description:
        "자동차 사이버보안 담당자가 ISO/SAE 21434, UN R155 같은 표준 문서와 내부 TARA 표를 매번 직접 찾아보는 비효율을 없애고 싶어 시작한 RAG 시스템입니다. TARA 자동화 도구(tAIRA)가 분석 단계마다 이 시스템을 호출해 근거 컨텍스트를 받아갑니다.",
      role:
        "임베딩 모델 선정부터 검색 전략, LLM 답변 생성, API 연동까지 RAG 파이프라인 전체를 단독으로 설계·구현했습니다. 특히 '표준 식별자를 정확히 찾는 것'과 '민감 데이터를 외부로 보내지 않는 것' 두 가지 제약 아래에서 어떤 구조가 최선인지 고민하는 과정이 핵심이었습니다.",
    },
    architecture: {
      diagram: "/images/rag_arch.svg",
      description:
        "질문을 dense+sparse로 임베딩해 FAISS로 후보를 뽑고, 두 점수를 0.7/0.3으로 결합한 뒤 cross-encoder로 상위 5개를 재정렬해 Ollama에 근거로 넣어 한국어 답변을 생성합니다. 문서는 오프라인에서 청킹·임베딩해 증분 인덱싱합니다.",
      reasoning:
        "처음에는 dense 검색만으로 충분할 줄 알았는데, 'M013-1 위협은 뭐야?' 같은 식별자 질의에서 엉뚱한 결과가 나왔습니다. 의미 임베딩은 식별자처럼 의미가 없는 코드를 잘 구분하지 못했기 때문입니다. 그래서 sparse 검색을 함께 쓰는 하이브리드 구조로 바꿨고, BGE-M3가 한 모델에서 dense와 sparse를 모두 뽑아줘서 파이프라인을 단순하게 유지할 수 있었습니다. cross-encoder는 정확도가 좋지만 느려서 전체에 적용하면 응답이 수 초가 걸렸고, 상위 20개에만 적용하는 타협점을 찾았습니다. LLM은 GPT-4를 쓰면 성능이 좋겠지만 TARA 데이터가 사내 민감 정보라 외부 API에 보낼 수 없어서, 성능을 어느 정도 포기하고 사내 Ollama로 구성했습니다.",
    },
    techStack: [
      {
        name: "BGE-M3",
        role: "dense+sparse 임베딩",
        reason: "dense 모델과 sparse 모델을 따로 운영하면 파이프라인이 복잡해지는데, BGE-M3는 한 번의 인코딩으로 두 벡터를 모두 뽑아줘서 구조를 단순하게 가져갈 수 있었습니다.",
      },
      {
        name: "FAISS",
        role: "벡터 인덱스·후보 검색",
        reason: "Milvus나 Weaviate 같은 벡터DB도 검토했지만, 문서가 수천 건 수준이라 별도 서버를 띄우는 건 과한 판단이었습니다. 파일 기반 FAISS로 충분했고 배포도 간단했습니다.",
      },
      {
        name: "Cross-Encoder Reranker",
        role: "후보 재정렬",
        reason: "1차 검색 결과의 순위가 만족스럽지 않았는데, cross-encoder로 질문과 청크를 함께 보면 관련도 판단이 훨씬 정확해졌습니다. 다만 전체에 적용하면 너무 느려서 상위 20개로 제한했습니다.",
      },
      {
        name: "Ollama (qwen2.5:3b)",
        role: "한국어 답변 생성",
        reason: "GPT-4가 답변 품질은 좋았지만 TARA 데이터를 외부 API에 보낼 수 없었습니다. 사내에서 돌릴 수 있는 모델 중 한국어 성능이 괜찮은 qwen2.5를 택했고, 3b 사이즈는 응답 속도와 품질의 균형점이었습니다.",
      },
      {
        name: "FastAPI",
        role: "질의 API·tAIRA 연동",
        reason: "tAIRA가 Python 기반이라 같은 언어로 연동하는 게 자연스러웠고, 추론 호출이 전부 동기 블로킹이라 asyncio.to_thread로 스레드풀에 넘기는 전략을 쓰기 위해 async 프레임워크가 필요했습니다.",
      },
      {
        name: "Docker Compose",
        role: "배포·데이터 분리",
        reason: "공개 표준 문서는 이미지에 번들링하고, 민감한 TARA 데이터와 인덱스는 호스트 볼륨으로 분리했습니다. 데이터 유출 없이 이미지만 교체해 배포할 수 있는 구조를 의도했습니다.",
      },
    ],
    problemSolving: [
      {
        issue:
          "'M013-1 위협을 설명해줘'처럼 표준·위협 식별자를 묻는 질의에서 정작 해당 항목을 찾지 못하고 엉뚱한 결과가 나왔습니다.",
        analysis:
          "dense 임베딩은 'M013-1'처럼 의미가 없는 코드를 '자동차', '보안' 같은 일반 단어와 구분하지 못했습니다. reranker도 식별자를 서브워드로 쪼개버려서 오히려 정확 매칭을 방해했습니다.",
        solution:
          "dense 0.7 + sparse 0.3으로 점수를 결합해 정확 토큰 매칭을 보강하고, 입력에서 ID 패턴(M013-1, ISO 15.4 등)이 감지되면 reranker를 우회한 뒤 sparse 매칭을 부스트하도록 분기했습니다. '모든 질의를 같은 파이프라인으로 처리해야 한다'는 생각을 버린 게 핵심이었습니다.",
        result:
          "식별자 질의에서 해당 항목이 안정적으로 상위에 노출됐고, 일반 질의는 기존대로 reranker를 거쳐 관련도를 유지했습니다.",
      },
      {
        issue:
          "임베딩·FAISS·reranker·Ollama 호출이 모두 동기 블로킹이라 동시에 2개 이상 질의가 들어오면 뒤의 요청이 앞의 추론이 끝날 때까지 멈췄습니다.",
        analysis:
          "FastAPI는 async인데 추론 라이브러리들은 전부 동기여서, async 함수 안에서 직접 호출하면 이벤트 루프 자체가 블로킹됐습니다.",
        solution:
          "모든 블로킹 호출을 asyncio.to_thread로 스레드풀에 위임했고, RAG 쪽이 실패하더라도 tAIRA의 TARA 분석은 빈 컨텍스트로 계속 진행되도록 graceful degradation을 설계했습니다. RAG는 보조 도구이지 tAIRA의 핵심 흐름을 막으면 안 된다는 판단이었습니다.",
        result:
          "동시 질의에서 이벤트 루프 블로킹이 사라졌고, RAG 장애가 tAIRA 전체 분석을 중단시키지 않습니다.",
      },
    ],
    retrospective: {
      improvements:
        "임베딩부터 답변 생성까지 RAG 파이프라인 전체를 직접 설계하면서, '만능 파이프라인'보다 '질의 유형별 분기'가 더 실용적이라는 걸 배웠습니다.",
      regrets:
        "recall@k 같은 정량 평가 없이 '결과가 괜찮아 보이는지'로 튜닝한 점이 가장 아쉽습니다. 평가 기준이 없으니 개선인지 퇴보인지 확신할 수 없었습니다.",
      futureWork:
        "평가 하니스를 만들어 튜닝을 정량화하고, 인덱스 재빌드·배포를 GitOps로 자동화할 계획입니다.",
    },
    links: {},
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC 인프라",
    period: "2026.02 ~ 2026.03",
    overview: {
      description:
        "실제 서비스급 트래픽을 감당하는 쿠버네티스 플랫폼을 설계하고 싶어 시작한 프로젝트입니다. EKS 기반 애플리케이션 플랫폼과 Central VPC 중앙 관제 네트워크를 구축하고, QA 환경에서 2,000 RPS · 12만 요청으로 구조의 유효성을 직접 검증했습니다.",
      role: "팀장으로 전체 일정과 방향을 조율하면서 EKS 중심 아키텍처 설계를 주도했습니다. '부하가 걸렸을 때 어디서 먼저 터지는가'를 미리 예측하고 대응하는 것에 집중했습니다.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "Prod / QA / Dev / DR / Central VPC 5개 환경으로 나누고, Prod·QA는 CloudFront → ALB(Ingress) → EKS Pod 흐름을 멀티 AZ로 구성했습니다. 데이터 계층은 Aurora + RDS Proxy, Central VPC에 GitLab·모니터링·DNS 보안 관측을 모았습니다.",
      reasoning:
        "ECS도 검토했지만 KEDA·Karpenter 같은 오픈소스로 오토스케일링을 세밀하게 제어하고 싶었고, Helm 차트로 환경별 설정을 일관되게 관리하고 싶어서 EKS를 택했습니다. Central VPC는 처음에 없었는데, 환경마다 따로 모니터링을 붙이다 보니 알람이 흩어져서 전체 그림을 보기 어렵다는 문제를 느꼈고, 공통 서비스를 한 곳에 모아 관리하는 중앙 관제형으로 전환했습니다. DR은 Active-Active까지 갈 예산이 없어서, 평시에는 최소 리소스만 유지하고 장애 시 빠르게 확장하는 Pilot Light 전략으로 비용과 복구 시간의 균형을 맞췄습니다.",
    },
    techStack: [
      {
        name: "Terraform",
        role: "인프라 프로비저닝·DR 재현성",
        reason: "5개 환경을 콘솔에서 수동으로 맞추면 실수가 반복될 게 뻔했고, 특히 DR 환경은 평소에 안 쓰다가 장애 시 재현해야 하므로 코드로 정의하지 않으면 의미가 없다고 판단했습니다.",
      },
      {
        name: "AWS EKS",
        role: "애플리케이션 실행·오케스트레이션",
        reason: "ECS와 고민했지만, KEDA로 RPS 기반 스케일링을 하고 Karpenter로 노드까지 자동 확장하려면 쿠버네티스 생태계가 필요했습니다. '트래픽이 올라갈 때 Pod만이 아니라 노드까지 같이 늘어나는 구조'를 만들고 싶었습니다.",
      },
      {
        name: "KEDA",
        role: "요청량 기반 Pod 오토스케일링",
        reason: "HPA의 CPU 기반 스케일링은 실제 사용자 트래픽과 괴리가 컸습니다. Prometheus에서 수집한 Pod당 평균 RPS를 기준으로 확장해야 실제 부하에 맞게 반응할 수 있었고, 최소 45개 Pod 선기동으로 Cold Start 문제도 함께 해결했습니다.",
      },
      {
        name: "Karpenter",
        role: "노드 레벨 오토스케일링",
        reason: "KEDA가 Pod를 늘려도 노드가 부족하면 Pending이 발생합니다. Cluster Autoscaler는 반응이 느렸고, Karpenter는 Pending Pod를 감지해 필요한 사양의 노드를 빠르게 생성해줘서 Pod-노드 확장을 동시에 맞출 수 있었습니다.",
      },
      {
        name: "ArgoCD / GitOps",
        role: "선언형 배포 상태 관리",
        reason: "kubectl apply를 직접 치면 '지금 운영 환경이 Git과 같은 상태인지' 확신할 수 없었습니다. Git을 단일 소스로 삼아 배포 상태와 이력을 추적할 수 있어야 5개 환경을 관리할 수 있다고 판단했습니다.",
      },
      {
        name: "IRSA",
        role: "Pod 단위 AWS 권한 분리",
        reason: "노드에 IAM Role을 붙이면 그 노드 위의 모든 Pod가 같은 권한을 갖게 됩니다. Pod마다 필요한 권한만 ServiceAccount에 매핑해 보안 범위를 최소화하고 싶었습니다.",
      },
    ],
    problemSolving: [
      {
        issue:
          "부하 테스트 시 Spring Boot Pod가 부팅 완료 전에 트래픽을 받아 에러가 나고, HPA 기반 확장은 트래픽 증가를 따라가지 못해 응답 지연이 발생했습니다.",
        analysis:
          "Spring Boot는 부팅에 10~15초가 걸리는데 readiness probe 없이 바로 서비스에 등록됐고, HPA는 CPU 기준이라 실제 요청량 증가와 반응 시점이 달랐습니다. Pod는 늘어나도 노드가 부족해 Pending이 발생하는 문제도 겹쳤습니다.",
        solution:
          "startup/readiness/liveness probe를 분리해 부팅 완료 전 트래픽 유입을 차단하고, KEDA로 Pod당 평균 RPS 기준 스케일링으로 전환했습니다. 최소 45개 Pod를 선기동해 초반 부하를 흡수하고, Karpenter로 Pending 시 노드를 자동 확장해 Pod-노드 확장 타이밍을 맞췄습니다.",
        result:
          "QA에서 약 2,000 RPS를 60초간 유지하며 총 12만 요청을 무중단 처리했습니다.",
      },
      {
        issue:
          "워커 노드가 EKS API와 통신하지 못해 Join에 실패하거나 NotReady 상태로 빠졌습니다.",
        analysis:
          "처음에는 노드 자체의 문제인 줄 알았는데, 실제로는 Private Subnet의 라우팅 테이블이 NAT Gateway를 거치지 않아 컨트롤플레인에 도달하지 못한 네트워크 설정 오류였습니다.",
        solution:
          "서브넷 라우팅과 DNS 설정을 바로잡고, 인스턴스 타입별 MaxPods 한계도 함께 조정했습니다. 이 경험 이후 EKS 네트워크 체크리스트를 만들어 환경 추가 시 같은 실수를 반복하지 않도록 했습니다.",
        result:
          "노드 Join 문제가 해소되어 Karpenter 기반 오토스케일링이 안정적으로 동작했습니다.",
      },
    ],
    retrospective: {
      improvements:
        "'설계한 구조가 실제 부하에서 버티는가'를 직접 검증한 경험이 가장 컸습니다. 도면 위의 아키텍처와 실제 트래픽에서의 아키텍처는 다르다는 걸 체감했습니다.",
      regrets:
        "부하 테스트 전에 리소스 스펙을 충분히 시뮬레이션하지 못해 AWS 비용을 초과했고, Karpenter 설정을 GitOps 흐름에 완전히 통합하지 못한 채 프로젝트가 끝났습니다.",
      futureWork:
        "Karpenter까지 포함한 완전한 GitOps 자동화와, 부하 테스트 전 비용 시뮬레이션 프로세스를 갖추고 싶습니다.",
    },
    links: {
      velog: "https://velog.io/@eomkyeongmun/series/CJ-%EC%98%AC%EB%A6%AC%EB%B8%8C%EB%84%A4%ED%8A%B8%EC%9B%8D%EC%8A%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    },
  },
  {
    category: "devops",
    title: "개인 포트폴리오 사이트 구축",
    period: "2026.03 ~",
    thumbnail: "/images/real.png",
    overview: {
      description:
        "포트폴리오를 PDF로 보내달라는 요청을 받을 때마다 수동으로 만들기 귀찮아서, '웹으로 보여주고 PDF도 자동 생성되는 사이트'를 직접 만들기로 했습니다. 만드는 김에 프론트부터 인프라·CI/CD까지 전부 혼자 해보자는 목표로 시작했습니다.",
      role: "Next.js 프론트엔드, Puppeteer PDF 생성, 피드백 알림 시스템, Terraform IaC, GitHub Actions CI/CD까지 전 과정 단독 담당. '배포 버튼 한 번이면 끝'인 구조를 만드는 것이 개인적인 기준이었습니다.",
    },
    architecture: {
      diagram: "/images/real.png",
      description:
        "정적 페이지는 CloudFront(OAC) → S3로 서빙하고, PDF 생성과 피드백 제출은 API Gateway → Lambda로 처리합니다. 피드백은 EventBridge로 이메일 발송 Lambda와 느슨하게 연결했고, WAF·보안 헤더·X-Ray·CloudWatch 알람으로 보안과 관측을 확보했습니다.",
      reasoning:
        "EC2에 Next.js 서버를 올리는 게 가장 간단했지만, 포트폴리오 사이트는 트래픽이 거의 없어서 상시 서버 비용이 아까웠습니다. 정적 페이지는 S3+CloudFront로 비용을 거의 0에 가깝게 만들고, PDF 생성처럼 간헐적이지만 무거운 작업만 Lambda로 분리하는 구조를 택했습니다. 피드백 시스템은 처음에 수신 Lambda가 직접 이메일을 보내게 했는데, 나중에 Slack이나 DB 저장을 추가하고 싶을 때 Lambda를 수정해야 하는 게 싫어서 EventBridge로 분리했습니다. Rule만 추가하면 새 소비자를 붙일 수 있는 구조입니다.",
    },
    techStack: [
      {
        name: "Next.js 16 / React / TypeScript",
        role: "웹 페이지·PDF 렌더링 페이지 구현",
        reason: "Gatsby도 고려했지만 App Router의 정적 생성(SSG)이 S3 배포에 딱 맞았고, 데이터 타입을 TypeScript로 잡으면 프로젝트 데이터 구조가 바뀔 때 컴파일 단계에서 잡을 수 있어 선택했습니다.",
      },
      {
        name: "AWS S3 + CloudFront + OAC",
        role: "정적 파일 저장·글로벌 CDN",
        reason: "S3를 퍼블릭으로 여는 건 보안상 꺼려져서, OAC로 CloudFront를 통해서만 접근하도록 제한했습니다. 포트폴리오에 글로벌 CDN까지 필요할까 싶지만, CloudFront의 캐싱과 HTTPS 처리가 편해서 함께 적용했습니다.",
      },
      {
        name: "AWS Lambda + Puppeteer (컨테이너)",
        role: "서버리스 PDF 생성",
        reason: "Puppeteer의 Chromium 바이너리가 250MB 이상이라 ZIP 패키징 Lambda의 크기 제한(50MB)을 넘겼습니다. 컨테이너 이미지 Lambda로 전환하니 크기 제한 문제가 사라지고, PDF 요청이 하루 몇 건 정도라 서버를 띄우는 것보다 비용이 훨씬 낮았습니다.",
      },
      {
        name: "AWS API Gateway",
        role: "Lambda 호출 HTTP 엔드포인트",
        reason: "Lambda를 직접 URL로 노출할 수도 있지만, 나중에 인증이나 요청 제한을 추가할 때 API Gateway가 있어야 유연합니다. X-Ray 추적도 여기서 켜면 바로 되는 점이 좋았습니다.",
      },
      {
        name: "Amazon EventBridge + SES",
        role: "피드백 이벤트 처리·이메일 알림",
        reason: "피드백 수신 Lambda가 직접 이메일을 보내면 간단하지만, Slack 알림이나 DB 저장을 나중에 추가하려면 그때마다 Lambda 코드를 수정해야 합니다. EventBridge로 이벤트를 발행하면 소비자를 Rule로만 추가할 수 있어 확장이 자유로워집니다.",
      },
      {
        name: "Terraform",
        role: "전체 인프라 IaC",
        reason: "CloudFront·S3·WAF·Lambda 등 리소스가 10개가 넘으니 콘솔에서 수동으로 관리하면 '이거 왜 이렇게 설정돼 있지?'가 반복될 게 뻔했습니다. 코드로 정의하면 설정 의도가 히스토리에 남고, 환경을 통째로 재현할 수 있습니다.",
      },
      {
        name: "GitHub Actions",
        role: "프론트·Lambda 배포 자동화",
        reason: "매번 빌드 → S3 업로드 → 캐시 무효화를 수동으로 하다 보면 빠트리는 단계가 생겼습니다. push 한 번이면 전체가 돌아가도록 자동화하니 배포 실수가 완전히 사라졌습니다.",
      },
    ],
    problemSolving: [
      {
        issue: "Lambda에서 Puppeteer로 PDF를 생성했더니 한글이 전부 □□□로 깨져 나왔습니다.",
        analysis:
          "Chromium은 시스템에 설치된 폰트를 쓰는데, Lambda 컨테이너 환경에는 한글 폰트가 아예 없었습니다. 로컬에서는 잘 되다가 Lambda에서만 깨지니 처음엔 인코딩 문제인 줄 알았지만, 폰트 부재가 원인이었습니다.",
        solution:
          "컨테이너 이미지에 Noto Sans KR을 번들링하고, print 페이지에서 document.fonts.ready를 기다린 뒤에 PDF를 캡처하도록 waitForFunction을 추가했습니다. 외부 CDN에 의존하면 네트워크 상태에 따라 또 깨질 수 있어서 이미지 내에 포함시키는 걸 선택했습니다.",
        result:
          "한글이 일관되게 렌더링되고, 외부 네트워크 의존 없이 어떤 환경에서든 같은 결과를 보장합니다.",
      },
      {
        issue: "배포 후 프로젝트 상세 페이지에서 뒤로가기나 홈 버튼을 누르면 홈이 아니라 프로젝트 페이지로 다시 돌아갔습니다.",
        analysis:
          "모든 정적 파일에 immutable 캐시를 건 게 문제였습니다. Next.js의 RSC 페이로드(.rsc)까지 장기 캐시가 적용돼서, 브라우저가 오래된 라우팅 데이터를 계속 참조하고 있었습니다. '정적 파일은 다 오래 캐시해도 된다'는 단순한 생각이 원인이었습니다.",
        solution:
          "S3 업로드 단계에서 파일 유형별로 Cache-Control을 분리했습니다. HTML과 RSC 페이로드는 no-cache로, 콘텐츠 해시가 붙은 JS·CSS만 immutable로 적용했습니다.",
        result:
          "라우팅 문제가 해결됐고, 해시가 붙은 에셋의 캐시 효율은 그대로 유지됩니다.",
      },
    ],
    retrospective: {
      improvements:
        "프론트엔드부터 서버리스 백엔드, IaC, CI/CD까지 혼자 처음부터 끝까지 구축한 경험이 가장 컸습니다. 특히 '동작하는 것'과 '운영할 수 있는 것'의 차이를 WAF·X-Ray·CloudWatch 알람을 붙이면서 실감했습니다.",
      regrets:
        "PDF 첫 요청 시 Lambda Cold Start가 10초 가까이 걸리는데 아직 해결하지 못했고, Terraform 모듈이 커지면서 구조가 복잡해져 리팩터링이 필요합니다.",
      futureWork:
        "Provisioned Concurrency로 Cold Start를 줄이고, 피드백 시스템에 Slack 알림과 DB 저장을 EventBridge Rule로 추가할 계획입니다.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
      velog: "https://velog.io/@eomkyeongmun/series/project",
    },
  },
];
