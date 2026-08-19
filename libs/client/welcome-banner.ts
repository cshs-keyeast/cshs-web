const GENERATION_BASE_YEAR = 2010; // 2026년 입학생이 16기이므로 입학연도 - 2010 = 기수
const WELCOME_BANNER_START_MONTH = 3; // 3월 1일부터 노출 시작
const WELCOME_BANNER_DURATION_DAYS = 31; // 노출 기간(일)

export default function getWelcomeBannerInfo() {
  const kstDateStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const [year, month, day] = kstDateStr.split('-').map(Number);

  const start = new Date(year, WELCOME_BANNER_START_MONTH - 1, 1);
  const end = new Date(start);
  end.setDate(end.getDate() + WELCOME_BANNER_DURATION_DAYS);
  const today = new Date(year, month - 1, day);

  return {
    show: today >= start && today < end,
    generation: year - GENERATION_BASE_YEAR,
  };
}
