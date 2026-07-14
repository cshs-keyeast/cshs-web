import { NextResponse } from 'next/server';
import client from '@/libs/server/client';
import getServerSessionCM from '@/libs/server/session';

const bcrypt = require('bcryptjs');
const saltRounds = 10;

async function isAdmin(session: any) {
  if (!session?.user?.email) return false;
  const user = await client.user.findUnique({ where: { email: session.user.email } });
  return (Number(user?.admin) & 2) === 2;
}

export async function GET(req: Request) {
  const session = await getServerSessionCM();
  // if (!(await isAdmin(session))) {
  //   return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  // }
  const users = await client.user.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  return NextResponse.json({ users });
}

export async function PATCH(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const { id, data } = await req.json();
  // type 변환 처리 (student: 0, teacher: 1)
  if (data.type === 'student') data.type = 0;
  if (data.type === 'teacher') data.type = 1;
  const user = await client.user.update({
    where: { id },
    data
  });
  return NextResponse.json({ user });
}

export async function DELETE(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const { ids } = await req.json();
  await client.user.updateMany({
    where: { id: { in: ids } },
    data: { type: 10 }
  });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const session = await getServerSessionCM();
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }
  const { name, userId, type, admin, password } = await req.json();
  let typeNum = 0;
  if (type === 'student') typeNum = 0;
  else if (type === 'teacher') typeNum = 1;
  else if (type === 'general') typeNum = 2;

  await bcrypt.genSalt(saltRounds, async function(err:any, salt:any) {
    await bcrypt.hash(password, salt, async function(err:any, hash:any) {
      const user = await client.user.create({
        data: {
          name,
          userId,
          type: typeNum,
          admin,
          password: hash,
          provider: 'google',
          email: userId,
          affiliationSchoolId: 1,
        }
      });
      return NextResponse.json({ user });
    });
  });
}
