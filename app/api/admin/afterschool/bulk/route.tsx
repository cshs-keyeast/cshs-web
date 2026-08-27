import { NextResponse } from 'next/server';
import client from '@/libs/server/client';
import getServerSessionCM from '@/libs/server/session';
import papa from 'papaparse';

async function getAdminUser(session: any) {
  if (!session?.user?.email) return null;
  const user = await client.user.findUnique({ where: { email: session.user.email } });
  if (!user || (Number(user.admin) & 8) !== 8) return null;
  return user;
}

// date(yyyyMMdd), grade, class, subject

export async function POST(req: Request) {
  const session = await getServerSessionCM();
  const admin = await getAdminUser(session);
  if (!admin || !admin.affiliationSchoolId) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const formdata = await req.formData();
  const file = formdata.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: '파일 없음' }, { status: 400 });
  }

  const csvText = await file.text();
  const result = papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });

  const rows = (result.data as any[]).filter(row => row.date && row.grade && row.class && row.subject);
  const affiliationSchoolId = admin.affiliationSchoolId;

  await client.$transaction(
    rows.map(row =>
      client.afterschool.upsert({
        where: {
          affiliationSchoolId_date_grade_class: {
            affiliationSchoolId,
            date: '' + row.date,
            grade: Number(row.grade),
            class: Number(row.class)
          }
        },
        update: {
          subject: '' + row.subject
        },
        create: {
          affiliationSchoolId,
          date: '' + row.date,
          grade: Number(row.grade),
          class: Number(row.class),
          subject: '' + row.subject
        }
      })
    )
  );

  return NextResponse.json({ success: true });
}
