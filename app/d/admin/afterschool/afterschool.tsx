'use client';

import { useState } from "react";
import { CSVLink } from "react-csv";
import Button from "@components/button";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";

export default function AdminAfterschoolPanel() {
  const dispatch = useAppDispatch();
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkFileName, setBulkFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleBulkUpload = async ({ target }: any) => {
    const file = target.files[0];
    if (!file) return;
    setBulkFile(file);
    setBulkFileName(file.name);
  };

  const handleBulkSubmit = async () => {
    if (!bulkFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', bulkFile);
      const res = await fetch('/api/admin/afterschool/bulk', {
        method: 'POST',
        body: formData,
        headers: {}
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        dispatch(setNotification({ type: 'error', text: data?.error ?? '업로드에 실패했습니다.' }));
        return;
      }
      dispatch(setNotification({ type: 'success', text: '방과후 시간표 업로드 완료' }));
      setBulkFile(null);
      setBulkFileName('');
    } catch {
      dispatch(setNotification({ type: 'error', text: '업로드 중 오류가 발생했습니다.' }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-5 flex flex-col space-y-5 mb-20 md:mb-0 max-w-[500px]">
      <div className="text-lightgray-200 text-sm leading-relaxed">
        8교시 방과후 시간표는 나이스에서 제공되지 않아 CSV로 직접 업로드합니다.<br/>
        같은 날짜·학년·반의 데이터를 다시 업로드하면 기존 내용이 최신 내용으로 덮어써집니다.
      </div>
      <CSVLink
        data={[["date", "grade", "class", "subject"], ["20260901", "1", "1", "코딩"]]}
        filename="방과후 시간표 양식.csv"
        className="w-full h-[55px] rounded-2xl hover:border-gray-300 focus:border-blue-500 transition-all px-4 outline-none border-2 border-lightgray-100 flex items-center"
      >
        <div className="w-full text-lg text-center">CSV 파일 양식 다운받기</div>
      </CSVLink>
      <label htmlFor="afterschoolBulkInput" className="w-full h-[55px] rounded-2xl hover:border-gray-300 focus:border-blue-500 transition-all px-4 outline-none border-2 border-lightgray-100 flex items-center">
        <div className="w-full text-lg text-center">
          {bulkFileName === '' ? "CSV 파일 업로드" : bulkFileName}
        </div>
      </label>
      <input type="file" onChange={handleBulkUpload} accept=".csv" id="afterschoolBulkInput" className="hidden" />
      <div className="text-xs text-gray-500">※ 엑셀에서 저장할 때 "CSV UTF-8(쉼표로 분리)" 형식으로 저장해야 한글이 깨지지 않습니다.</div>
      <Button color="blue" fn={handleBulkSubmit} disabled={!bulkFile} loading={uploading}>
        <div className="px-6 py-1">업로드</div>
      </Button>
    </div>
  );
}
