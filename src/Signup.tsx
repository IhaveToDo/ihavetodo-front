import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button1, Button2, ShadowBox } from './components/Atomic';
import styled from '@emotion/styled';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import client from './lib/client';
import { AxiosResponse } from 'axios';
import InputBox1 from './components/InputBox1';
import { keyframes } from '@emotion/react';

const Signup = () => {
    const navigate: NavigateFunction = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const [error, setError] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        document.title = '회원가입';
        if (localStorage.getItem('accessToken') != null) {
            navigate('/', { replace: true });
        }
    }, []);

    useEffect(() => {
        if (error != '') {
            setShowError(true);
            setTimeout(() => {
                setError('');
                setShowError(false);
            }, 6000);
        }
    }, [error]);

    const register = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!username || !password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
        } else if (password !== passwordConfirm) {
            setError('비밀번호 확인이 일치하지 않습니다.');
        } else {
            client.post('/auth/register', { username, password }).then(
                (res: AxiosResponse) => {
                    if (res.data.success) navigate('/login', { replace: true });
                },
                (err) => {
                    setError('아이디 또는 비밀번호가 잘못되었습니다.');
                },
            );
        }
    };

    const fadeIn = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `;

    const fadeOut = keyframes`
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  `;
    const ErrorBackground = styled.div`
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        z-index: 9999999;
        visibility: ${showError ? 'visible' : 'hidden'};
        animation: ${showError ? fadeIn : fadeOut} 0.3s ease-out;
    `;

    const ErrorContent = styled.div`
        padding: 12px 18px;
        display: flex;
        align-items: center;
        background: var(--lightRed);
        color: var(--heavyRed);
        font-size: 15px;
        margin-top: 60px;
        font-weight: 600;
        border-radius: 14px;
        transition: all 0.3s ease-in-out;
        visibility: ${showError ? 'visible' : 'hidden'};
        animation: ${showError ? fadeIn : fadeOut} 0.3s ease-out;
    `;

    return (
        <>
            <PageWrapper>
                <PageTitle>
                    당신의 할 일, <br />
                    <PageTitleStrong>할일해야지</PageTitleStrong>에서 <br />
                    모두 관리하세요!
                </PageTitle>
                <RegisterBox>
                    <BoxTitle>회원가입</BoxTitle>
                    <LoginForm>
                        <InputContainer>
                            <InputLabel>아이디</InputLabel>
                            <InputBox1
                                placeholder={'아이디를 입력해주세요.'}
                                value={username}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setUsername(e.target.value)}
                            />
                        </InputContainer>
                        <InputContainer>
                            <InputLabel>비밀번호</InputLabel>
                            <InputBox1
                                placeholder={'비밀번호를 입력해주세요.'}
                                value={password}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setPassword(e.target.value)}
                                type={'password'}
                            />
                            <InputBox1
                                placeholder={'비밀번호를 재입력해주세요.'}
                                value={passwordConfirm}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setPasswordConfirm(e.target.value)}
                                type={'password'}
                            />
                        </InputContainer>
                    </LoginForm>
                    <ActionButtons>
                        <LoginButton onClick={(e) => register(e)}>
                            회원가입
                        </LoginButton>
                        <SignupButton onClick={() => navigate('/login')}>
                            로그인
                        </SignupButton>
                    </ActionButtons>
                </RegisterBox>
            </PageWrapper>

            <ErrorBackground>
                <ErrorContent>{error}</ErrorContent>
            </ErrorBackground>
        </>
    );
};

const ActionButtons = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 43px;
`;

const LoginButton = styled(Button1)`
    width: 183px;
    height: 43px;
    padding: 0;
`;

const SignupButton = styled(Button2)`
    width: 183px;
    height: 43px;
    padding: 0;
`;

const LoginForm = styled.div`
    margin-top: 60px;
    width: 100%;
    gap: 21px;
    display: flex;
    flex-direction: column;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
`;

const InputLabel = styled.div`
    padding-left: 5px;
    font-weight: 500;
    font-size: 12px;

    color: var(--inputColor);
`;

const BoxTitle = styled.div`
    font-weight: 700;
    font-size: 28px;
    color: var(--accentColor);
`;

const RegisterBox = styled(ShadowBox)`
    width: 418px;
    height: 408px;
    padding: 33px 24px 24px 22px;
    display: flex;
    flex-direction: column;
`;

const PageWrapper = styled.div`
    width: 1109px;
    height: 650px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PageTitle = styled.div`
    font-weight: 700;
    font-size: 35px;
    line-height: 42px;
    color: var(--textColor);
`;

const PageTitleStrong = styled.span`
    color: var(--accentColor);
`;

export default Signup;
