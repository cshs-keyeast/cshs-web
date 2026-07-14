import { NextResponse } from 'next/server';
import client from '@/libs/server/client';
import getServerSessionCM from '@/libs/server/session';
import papa from 'papaparse';

const bcrypt = require('bcryptjs');
const saltRounds = 10;

async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await client.user.findUnique({ where: { email: session.user.email } });
  return (Number(user?.admin) & 2) === 2;
}

// user.id, user.userId, user.name, user.grade, user.class, user.number || user.id, user.userId, user.name

export async function POST(req: Request) {
  const session = await getServerSessionCM();
 if (!(await isAdmin(session))) {
   return NextResponse.json({ error: '권한 없음' }, { status: 403 });
 }
  const formdata = await req.formData();
  const type = formdata.get('type') as string;
  const file = formdata.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: '파일 없음' }, { status: 400 });
  }
  const csvText = await file.text();
  const result = papa.parse(csvText, { header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });
  if (type === 'student') {
    result.data.forEach(async function (data: any) {
      const user = await client.user.create({
        data: {
          id: data.id,
          name: data.name + '',
          userId: data.userId + '',
          type: 0,
          password: null,
          grade: data.grade,
          class: data.class,
          number: data.number,
          provider: 'local',
          email: '' + data.userId + '@school.local',
          affiliationSchoolId: 1
        }
      });
    });
  }
  if (type === 'teacher') {
    result.data.forEach(async function (data: any) {
      await bcrypt.genSalt(saltRounds, async function(err: any, salt: any) {
        await bcrypt.hash(data.userId, salt, async function(err: any, hash: any) {
          const user = await client.user.create({
            data: {
              id: data.id,
              name: data.name + '',
              userId: data.userId + '',
              type: 1,
              password: null,
              provider: 'local',
              email: '' + data.userId + '@school.local',
              affiliationSchoolId: 1
            }
          });
          
        });
      })
    });
  }
  return NextResponse.json({ success: true } );
}

export async function PUT(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const formdata = await req.formData();
  const type = formdata.get('type') as string;
  const file = formdata.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: '파일 없음' }, { status: 400 });
  }
  const csvText = await file.text();
  const result = papa.parse(csvText, { header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });
  if (type === 'student') {
    await client.$transaction(
      result.data.map((data: any) => 
        client.user.update({
          where: { id: data.id },
          data: {
            userId: data.userId + '',
            name: data.name + '',
            grade: data.grade,
            class: data.class,
            number: data.number
          }
        })
      )
    );
  }
  else if (type === 'teacher') {
    await client.$transaction(
      result.data.map((data: any) => 
        client.user.update({
          where: { id: data.id },
          data: {
            userId: data.userId + '',
            name: data.name + '',
          }
        })
      )
    );
  }
  return NextResponse.json({ success: true } );
}
