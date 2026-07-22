'use client';

import type { NextPage } from 'next'
import Head from 'next/head'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'
import { Suspense, use, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '@libs/client/redux/notification'
import useSWR from 'swr';
import Input from '@components/input';
import Button from '@components/button';
import Link from 'next/link';

function LoginContainer() {
  return (
    <Suspense>
      <Login/>
    </Suspense>
  )
}

const Login: NextPage = () => {
  const pathname = useSearchParams();
  const callbackUrl = pathname.get('callbackUrl');
  const error = pathname.get('error');
  const dispatch = useDispatch();

  useEffect(() => {
    if(error) {
      if(error === 'Incorrect-ID-or-PW') {
        dispatch(setNotification({ type: "error", text: "아이디 또는 비밀번호를 확인해주세요" }))
      } else {
        dispatch(setNotification({ type: "error", text: "오류가 발생하여 로그인을 완료하지 못했어요" }));
      }
    }
  }, [error]);

  const { data } = useSWR('/api/user');
  useEffect(() => {
    if(data?.success === true) {
      location.href = `/login/success?callbackUrl=${callbackUrl}`;
    }
  }, [data]);

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if(id === '') return;
        if(pw === '') return;
        setLoading(true);
        signIn('credentials', { callbackUrl: `/login/success?callbackUrl=${callbackUrl}`, id: id, password: pw });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, pw]);

  return (
    <div className='overflow-hidden'>
      <Head>
        <title>로그인</title>
      </Head>
      <div className="w-[100vw] h-[100vh] min-h-[800px] font-pretendard">
        <div style={{
          backgroundImage: 'linear-gradient(to top, #ffffff 0%, #bfdbfe 99%, #bfdbfe 100%)'
        }} className="w-full h-[100vh] bg-cover opacity-70 bg-opacity-0 overflow-hidden min-h-[800px]"></div>
        <div className='fixed right-0 left-0 bottom-7 hidden justify-center items-center md:flex'>
          <div className='mx-auto p-3 rounded-xl bg-blue-100 text-sm md:block hidden'>
            {/* <div className='text-blue-500 text-center'>비밀번호 변경 등 문의: <span className='underline'>14c76@csh-h.gne.go.kr</span></div> */}
            <div className='text-blue-500 text-center'>교사 아이디는 기존과 동일, 학생 아이디는 학번입니다.<br/>초기 비밀번호는 아이디와 동일합니다. 로그인 후 반드시 비밀번호를 변경하시기 바랍니다.{/*<br/><Link href='http://10.15.150.20:8888/68267cfd-7e11-448c-af27-c1c1bca759ad/-------------------39a74ba6-478a-4f41-ad54-3f19a0b5c6b6' target={'_blank'}>이용 가이드를 읽어보세요: <span className='underline'>이용 가이드 보기</span></Link></div>*/}
          </div>
        </div>
        <div className='absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full xl:w-[750px] mt-7'>
          <div className="md:space-y-2 flex flex-col justify-center items-center overflow-hidden">
            <div className='font-bold text-center text-2xl md:text-3xl mb-5'>로그인</div>
            <div className='w-[93vw] md:w-[380px] space-y-1 items-center flex flex-col mb-10'>
              <Input placeholder='아이디' fn={(value:string) => setId(value)} autoFocus />
              <Input placeholder='비밀번호' type='password' fn={(value:string) => setPw(value)} />
              <div className='pt-2 w-full'>
                <Button loading={loading} fn={() => {
                  // 임시 로그인용 - 실제 서비스 시 패스워드 공백도 확인!
                  if(id === '') return;
                  setLoading(true);
                  signIn('credentials', { callbackUrl: `/login/success?callbackUrl=${callbackUrl}`, id: id, password: pw });
                }} color='blue'>로그인</Button>
              </div>
            </div>
            {/* <div className='flex items-center justify-between w-[93vw] md:w-[380px] py-4'>
              <div className='h-[1px] bg-gray-300 w-full'></div>
              <div className='w-full text-gray-300 text-sm text-center'>또는 소셜 로그인</div>
              <div className='h-[1px] bg-gray-300 w-full'></div>
            </div>
            <div className='space-y-2 pb-20'>
              <div onClick={() => signIn('google', { callbackUrl: `/login/success?callbackUrl=${callbackUrl}` })} className='flex px-5 py-3 rounded-xl shadow-black/10 bg-white shadow-2xl md:text-lg font-bold w-[93vw] md:w-[380px] items-center cursor-pointer hover:bg-gray-50 transition-colors'>
                <svg className='w-[30px] h-[30px] cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64"><defs><path id="A" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></defs><clipPath id="B"><use href="#A"/></clipPath><g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)"><path d="M0 37V11l17 13z" clipPath="url(#B)" fill="#fbbc05"/><path d="M0 11l17 13 7-6.1L48 14V0H0z" clipPath="url(#B)" fill="#ea4335"/><path d="M0 37l30-23 7.9 1L48 0v48H0z" clipPath="url(#B)" fill="#34a853"/><path d="M48 48L17 24l-4-3 35-10z" clipPath="url(#B)" fill="#4285f4"/></g></svg>
                <div className='text-center left-0 right-0 absolute'>구글로 로그인</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginContainer
