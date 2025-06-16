"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCompanyList } from '@/hooks/input/useCompany';


interface CompanyListDate{
    company: string;
    occupation: string;
    member: number;
    selection: string;
    intern: boolean;
}

export default function Main() {
    const router = useRouter();
    const {addCompanyList, error, resetError} = useCompanyList();
    const [formData, setFormData] = useState<CompanyListDate>({
        company: '',
        occupation: '',
        member: 1,
        selection: '',
        intern: false,
    });

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/');
                return;
            }

            // JWTトークンをデコード
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = payload.exp * 1000; // ミリ秒に変換
                
                if (Date.now() >= expirationTime) {
                    // トークンが期限切れの場合
                    localStorage.removeItem('token');
                    router.push('/');
                }
            } catch (error) {
                // トークンのデコードに失敗した場合
                localStorage.removeItem('token');
                router.push('/');
            }
        };

        // 初回チェック
        checkToken();

        // 5秒ごとにトークンをチェック
        const interval = setInterval(checkToken, 5000);

        // クリーンアップ
        return () => clearInterval(interval);
    }, [router]);

    //入力値の値を変更する関数
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' 
                ? (e.target as HTMLInputElement).checked 
                : name === 'member'  // memberフィールドの場合
                    ? parseInt(value) || 1  // 数値に変換、無効な値の場合は1をデフォルト値として使用
                    : value
        }));
    };
    
    // 3. handleSubmit関数の修正
    const handleSubmit = async (date: CompanyListDate) => {
        try {
            // 送信前に数値型であることを確認
            const submitData = {
                ...date,
                member: Number(date.member) || 1  // 確実に数値型に変換
            };
            await addCompanyList(submitData);
            alert("企業情報を追加しました！");
            router.push('/companylists');
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert('予期せぬエラーが発生しました');
            }
        }
    };

return (
    <>
        <Header />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">企業情報追加</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                    <button 
                        onClick={resetError}
                        className="text-sm underline"
                    >
                        閉じる
                    </button>
                </div>
            )}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(formData);
            }} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                            企業名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                            職種
                        </label>
                        <input
                            id="occupation"
                            name="occupation"
                            type="text"
                            value={formData.occupation}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="member" className="block text-sm font-medium text-gray-700">
                            人数 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="member"
                            name="member"
                            type="number"
                            value={formData.member}
                            onChange={handleChange}
                            required
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="selection" className="block text-sm font-medium text-gray-700">
                            選考ステータス
                        </label>
                        <select
                            id="selection"
                            name="selection"
                            value={formData.selection}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">選択してください</option>
                            <option value="一次面接">一次面接</option>
                            <option value="二次面接">二次面接</option>
                            <option value="最終面接">最終面接</option>
                            <option value="内定">内定</option>
                            <option value="不採用">不採用</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="intern"
                            name="intern"
                            type="checkbox"
                            checked={formData.intern}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="intern" className="ml-2 block text-sm text-gray-700">
                            インターン希望
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        確定
                    </button>
                </form>
            </div>
        </>
    );
}
