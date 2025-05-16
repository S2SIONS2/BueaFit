'use client';

import { useState } from "react";

interface CustomerInfo {
  name: string;
  phone_number: string | number;
  memo?: string;
  group_name?: string;
}

export default function ModifyCustomerModal({name, phone_number, memo, group_name}: CustomerInfo) {
    const [modifyGroup, setModifyGroup] = useState('');
    const [modifyName, setModifyName] = useState('');
    const [modifyPhone, setModifyPhone] = useState('');
    const [modifyMemo, setModifyMemo] = useState('');

    // 내용 수정

    return (
        <section>
            <h1>고객 수정</h1>
            <div>
                <div>
                    <p>그룹</p>
                    <input type="text" value={modifyGroup} onChange={(e) => setModifyGroup(e.target.value)}/>
                </div>
                <div>
                    <p>이름</p>
                    <input type="text" value={modifyName} onChange={(e) => setModifyName(e.target.value)} />
                </div>
                <div>
                    <p>전화번호</p>
                    <input type="number" value={modifyPhone} onChange={(e) => setModifyPhone(e.target.value)} />
                </div>
                <div>
                    <p>메모</p>
                    <input type="text" value={modifyMemo} onChange={(e) => setModifyMemo(e.target.value)} />
                </div>
            </div>
        </section>
    )
}