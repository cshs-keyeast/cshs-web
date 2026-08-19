import displayDate from './time-display';

const GENERATION_BASE_YEAR = 2010; // 2026년 입학생이 16기이므로 입학연도 - 2010 = 기수
const WELCOME_BANNER_START_MONTH = 3; // 3월 1일부터 노출 시작
const WELCOME_BANNER_DURATION_DAYS = 31; // 노출 기간(일)

export default function getWelcomeBannerInfo() {
  const year = new Date().getFullYear();

  const start = new Date(year, WELCOME_BANNER_START_MONTH - 1, 1);
  const end = new Date(start);
  end.setDate(end.getDate() + WELCOME_BANNER_DURATION_DAYS);

  const daysUntilStart = Number(displayDate(start, 'date-left'));
  const daysUntilEnd = Number(displayDate(end, 'date-left'));

  return {
    show: daysUntilStart <= 0 && daysUntilEnd > 0,
    generation: year - GENERATION_BASE_YEAR,
  };
}
