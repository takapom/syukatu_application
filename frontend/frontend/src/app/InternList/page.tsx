"use client"

import useIntern from "@/hooks/get/useIntern"
import Header from "@/components/Header"
import Link from "next/link";

export default function InternList() {
    const {internships, loading, error} = useIntern();
    console.log(internships);
    return (
        <div>
            <Header />
            <h1>インターンリスト</h1>
            <Link href="/AddIntern">
                <button>追加</button>
            </Link>
            {loading && <div>読み込み中...</div>}
            {error && <div style={{color: 'red'}}>エラー: {error}</div>}
            <ul>
                {internships.map((intern) => (
                    <li key={intern.id}>
                        <strong>{intern.title}</strong>（{intern.company}）<br />
                        時間: {intern.dailystart}時〜{intern.dailyfinish}時<br />
                        内容: {intern.content}<br />
                        選考状況: {intern.selection}<br />
                        参加: {intern.joined ? '済' : '未'}
                    </li>
                ))}
            </ul>
        </div>
    )
}