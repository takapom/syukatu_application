import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//フロントエンドで使用する型定義
interface Company {
    id: number;
    company: string;
    occupation: string;
    member: number;
    selection: string;
    intern: boolean;
    createdAt: string;
}

//バックエンドから返される型定義
interface CompanyResponse{
    ID: number;
    Company: string;
    Occupation: string;
    Member: number;
    Selection: string;
    Intern: boolean;
    CreatedAt: string;
}

export default function useCompany() {
    const [companyLists, setCompanyLists] = useState<Company[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const validateToken = (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            return Date.now() < expirationTime;
        } catch (err) {
            return false;
        }
    };

    const fetchCompanyLists = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push('/');
                throw new Error("ログインが必要です！");
            }

            if (!validateToken(token)) {
                localStorage.removeItem('token');
                router.push('/');
                throw new Error("セッションの有効期限が切れました。再度ログインしてください。");
            }

            const res = await fetch("http://localhost:8080/company_lists", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/');
                    throw new Error("認証に失敗しました。再度ログインしてください。");
                }
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            
            if (!Array.isArray(data)) {
                throw new Error("データの形式が不正です");
            }


        const validatedData = data.map((item: CompanyResponse) => ({
            id: item.ID,
            company: item.Company,
            occupation: item.Occupation || '未設定',
            member: item.Member || 1,
            selection: item.Selection || '未設定',
            intern: item.Intern,
            createdAt: item.CreatedAt
        }));

        console.log('Transformed data:', validatedData); // デバッグ用
        setCompanyLists(validatedData);
    } catch (err) {
        console.error('Error fetching company lists:', err);
        setError(err instanceof Error ? err : new Error('予期せぬエラーが発生しました'));
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
        fetchCompanyLists();
    }, []);

    return { companyLists, error, loading };
}