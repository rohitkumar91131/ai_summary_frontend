import React, { useEffect } from 'react'
import Header from '../../ui/Header'
import SummeriseArticle from '../../components/SummeriseArticle'
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

function HomePage() {
    const { isLoggedIn, setIsLoggedIn, verifyingToken, setVerifyingToken } = useAuth();
    useEffect(() => {
        setVerifyingToken(true);
        async function checkAuth() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                if (data.success) {
                    setIsLoggedIn(true);
                }
                else {
                    setIsLoggedIn(false);
                }


            } catch (err) {
                toast.error("Network error. Please try again later.");
            }
            finally {
                setVerifyingToken(false);
            }
        }
        checkAuth();
    }, []);

    return (
        <div className='min-h-[100dvh] w-[100dvw] bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 flex flex-col gap-4'>
            <Header />
            <SummeriseArticle />
        </div>
    )
}

export default HomePage
