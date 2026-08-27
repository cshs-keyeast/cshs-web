import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get timetable of today
async function GetHandler(req: Request) {
  const session = await getServerSessionCM();

  const user = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      affiliationSchool: {
        select: {
          id: true,
          ATPT_OFCDC_SC_CODE: true,
          SD_SCHUL_CODE: true,
        }
      },
      grade: true,
      class: true,
      type: true
    }
  });

  if (!user || !user.affiliationSchool) {
    return NextResponse.json({
      success: false,
      message: '사용자 정보를 찾을 수 없어요'
    }, { status: 404 });
  }
  if(user.type !== 0) {
    return NextResponse.json({
      success: false,
      message: '선생님은 시간표를 표시할 필요가 없어요.'
    }, { status: 400 });
  }

  const school = user.affiliationSchool;

  const dateParams = new URL(req.url).searchParams.get("date");

  let formatDate = dateParams
  
  if (formatDate == "" || formatDate == null || formatDate == undefined) {
    const date = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
    const today = new Date(date);
    const year = today.getFullYear();
    const month = today.getMonth()+1;
    const day = today.getDate();
    formatDate = year+""+(("00"+month.toString()).slice(-2))+""+(("00"+day.toString()).slice(-2));
  }

  const [existingTimetable, afterschool] = await Promise.all([
    client.timetable.findMany({
      where: {
        affiliationSchoolId: school.id,
        date: formatDate,
        grade: user.grade ?? undefined,
        class: user.class ?? undefined
      },
      orderBy: {
        perio: 'asc'
      }
    }),
    client.afterschool.findFirst({
      where: {
        affiliationSchoolId: school.id,
        date: formatDate,
        grade: user.grade ?? undefined,
        class: user.class ?? undefined
      }
    })
  ]);

  if(existingTimetable.length > 0) {
    if(existingTimetable[0].perio === 0) {
      return NextResponse.json({
        success: false,
        message: '시간표 정보를 찾을 수 없어요'
      }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      timetable: afterschool ? [...existingTimetable, { ...afterschool, perio: 8 }] : existingTimetable
    }, { status: 200 });
  }

  const timetableResponse = await fetch(`https://open.neis.go.kr/hub/hisTimetable?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${school.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${school.SD_SCHUL_CODE}&TI_FROM_YMD=${formatDate}&ALL_TI_YMD=${formatDate}&TI_TO_YMD=${formatDate}&GRADE=${user.grade}&CLASS_NM=${user.class}&KEY=${process.env.NEIS_API_KEY}`);

  if (!timetableResponse.ok) {
    return NextResponse.json({
      success: false,
      message: '시간표 정보를 가져오는 데 실패했습니다'
    }, { status: 400 });
  }
  const timetableData = await timetableResponse.json();

  if(timetableData?.RESULT?.MESSAGE === '해당하는 데이터가 없습니다.') {
    await client.timetable.create({
      data: {
        affiliationSchool: {
          connect: {
            id: school.id
          }
        },
        date: formatDate,
        grade: user.grade!,
        class: user.class!,
        perio: 0,
        subject: ''
      }
    });

    return NextResponse.json({
      success: false,
      message: '시간표 정보를 찾을 수 없어요'
    }, { status: 400 });
  }

  if (timetableData.hisTimetable) {
    const timetableRows = timetableData.hisTimetable[1].row;
    let timetableCreate = [];
    for(const timetableRow of timetableRows) {
      timetableCreate.push({
        affiliationSchoolId: school.id,
        date: timetableRow.ALL_TI_YMD,
        perio: +timetableRow.PERIO,
        subject: timetableRow.ITRT_CNTNT,
        class: +timetableRow.CLASS_NM,
        grade: +timetableRow.GRADE
      });
    }
    await client.timetable.createMany({
      data: timetableCreate
    });

    return NextResponse.json({
      success: true,
      timetable: afterschool ? [...timetableCreate, { ...afterschool, perio: 8 }] : timetableCreate
    }, { status: 200 });
  } else {
    return NextResponse.json({
      success: false,
      message: '시간표 정보를 찾을 수 없어요'
    }, { status: 400 });
  }
}

export const GET = withHandler({ method: "GET", fn: GetHandler });