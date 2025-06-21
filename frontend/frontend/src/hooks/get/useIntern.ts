//インターンシップ取得用のカスタムフック
"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//フロントエンドで使用する型定義
interface Intern{
    id: number;
    title: string;
    company: string;
    dailystart: number;
    dailyfinish: number;
    content: string;
    selection: string;
    joined: boolean;
}

//バックエンドから返される型定義
interface ResponseIntern{
    ID: number;
    Title: string;
    Company: string;
    Dailystart: number;
    Dailyfinish: number;
    Content: string;
    Selection: string;
    Joined: boolean;
}


export default function useIntern(){
    const [internships, setInternships] = useState<Intern[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchInternships = async () => {
        try{
            const token = localStorage.getItem("token");
            if (!token){
                router.push("/")
                throw new Error("もう一度ログインをしてください！");
            }
            const res = await fetch("http://localhost:8080/internships",{
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (!res.ok){
            if (res.status === 401) {
                localStorage.removeItem('token');
                router.push('/');
                throw new Error("認証に失敗しました。再度ログインしてください。");
            }
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        const validatedData = data.map((item: ResponseIntern) => ({
            id: item.ID, 
            title: item.Title,
            company: item.Company,
            dailystart: item.Dailystart,
            dailyfinish: item.Dailyfinish,
            content: item.Content,
            selection: item.Selection,
            joined: item.Joined,
        }));
        setInternships(validatedData);
    }catch(err){
        console.log('Error fetching internships:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching internships');
    }finally{
        setLoading(false);
    }
    };

    useEffect(() => {
        fetchInternships();
    }, []);
    return { internships, error, loading };
}