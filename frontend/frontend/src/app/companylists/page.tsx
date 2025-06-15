"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Main() {
    const router = useRouter();

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

    return (
        <div>
            <h1>メインページ</h1>
        </div>
    );
}