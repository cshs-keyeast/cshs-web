export default function PetitionTermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 pb-20 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 mt-10 text-gray-800">
        온라인 청원 게시판 이용규칙
      </h1>

      <div className="space-y-8">
        {/* 제1장 총칙 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-teal-600 border-b-2 border-teal-600 pb-2">
            제1장 총칙
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">제1조(목적)</h3>
            <p className="text-gray-600 leading-relaxed">
              본 규칙은 교내 청원 게시판의 원활한 운영을 도모하고, 학생 자치 문화의 건전한 발전에
              기여함을 목적으로 한다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-700">제2조(청원의 대상)</h3>
            <p className="text-gray-600 leading-relaxed">
              청원은 학교생활 전반에 걸친 제도 개선, 학생 복지 증진, 시설 환경 개선, 교육 활동 건의 등
              학교 공동체 전체의 이익과 관련된 사안을 대상으로 한다.
            </p>
          </div>
        </section>

        {/* 제2장 청원의 작성 및 동의 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-teal-600 border-b-2 border-teal-600 pb-2">
            제2장 청원의 작성 및 동의
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">제3조(작성 원칙)</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>
                청원 작성자는 육하원칙에 따라 청원의 취지, 현황, 제안 내용 등을 명확하고 논리적으로
                서술해야 한다.
              </li>
              <li>특정 인물(교사, 학생 등)에 대한 인신공격, 비방 명예훼손에 해당하는 내용은 포함할 수 없다.</li>
              <li>타인의 권리를 침해하거나 욕설, 비속어, 혐오 표현 등 불쾌감을 유발하는 언어 사용을 금지한다.</li>
              <li>동일한 내용의 청원이 이미 게시되어 있는지 확인한 후 작성해야 하며, 중복 청원은 반려될 수 있다.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-700">제4조(동의 원칙)</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>
                청원 내용에 동의하는 학생은 '동의하기' 버튼을 클릭하여 통해 자신의 의견을 표명할 수
                있다. 단, 같은 청원에 대한 동의는 1인 1동의로 제한한다.
              </li>
              <li>동의 표명은 청원의 취지와 내용에 대한 충분한 이해를 바탕으로 신중하게 이루어져야 한다.</li>
            </ol>
          </div>
        </section>

        {/* 제3장 청원의 심사 및 처리 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-teal-600 border-b-2 border-teal-600 pb-2">
            제3장 청원의 심사 및 처리
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">제5조(반려 대상 청원)</h3>
            <p className="text-gray-600 mb-3">다음 각 호에 해당하는 청원은 심사 과정에서 반려될 수 있다.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>학교의 안전 및 질서를 위협하는 내용</li>
              <li>개인, 집단, 특정 학년, 동아리 등에 대한 비방, 혐오, 차별, 혐오를 조장하는 내용</li>
              <li>개인의 사생활을 침해할 소지가 명백한 내용</li>
              <li>입증되지 않은 사실을 단정적으로 표현해 타인의 명예를 훼손하는 내용</li>
              <li>광고, 종교, 정치적인 내용</li>
              <li>순수한 학술적 질의 혹은 개인 간 민원 및 갈등 해결을 요구하는 내용</li>
              <li>이미 답변이 완료되었거나 등록된 청원과 동일한 내용</li>
            </ol>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">제6조(답변의 원칙 및 기준)</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>청원 게시 후 1달 이내 126명 이상의 동의를 얻은 청원에 대하여 학생회는 회의를 거쳐 공식적인 답변을 해야 함을 원칙으로 한다.</li>
              <li>학생회는 답변 요건을 충족한 청원에 대해 관련 부서 및 선생님과 협의해 실현 가능성, 추진 계획 등을 검토해야 한다.</li>
              <li>답변은 답변 요건 충족일 이후 바로 다음 학생회 회의에서 이루어짐을 원칙으로 하며, 청원에 대한 검토 과정, 최종 입장, 향후 계획 등을 포함해야 한다.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-700">제7조(청원의 종결)</h3>
            <p className="text-gray-600 mb-3">다음 각 호의 경우, 청원이 종결 처리될 수 있다.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>답변 요건을 충족하여 공식 답변이 완료된 경우</li>
              <li>답변 기간 내에 요건을 충족하지 못할 경우</li>
              <li>청원 내용이 사실과 명백히 다르거나, 청원인 스스로 철회를 요청한 경우</li>
              <li>청원의 목적이 달성되었거나, 상황 변화로 인해 논의의 실익이 없다고 판단되는 경우</li>
            </ol>
          </div>
        </section>

        {/* 부칙 */}
        <section className="border-t-2 border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">부칙</h2>
          <p className="text-gray-600">
            본 규칙에 명시되지 않은 사항은 학생회 회칙 및 일반적인 사회 통념에 따릅니다.
          </p>
          <p className="text-gray-600">
            본 규칙은 2025-10-20부터 효력을 발휘합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
