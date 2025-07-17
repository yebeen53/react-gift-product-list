import { useNavigate, useLocation } from 'react-router-dom';
import { css } from '@emotion/react';
import useCustomTheme from '@/hooks/useCustomTheme';
import useLoginForm from '@/hooks/useLoginForm';
import Button from '@/components/Button';
import type { Theme } from '@/data/theme';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
interface LocationState {
  from?: {
    pathName: string;
  };
}

const logContainer = (theme: Theme) => css`
  max-width: 360px;
  margin: 200px auto 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${theme.spacing.spacing5};
  color: ${theme.colors.semantic.textDefault};
`;

const logStyle = (theme: Theme, hasError: boolean) => css`
  width: 100%;
  padding: 8px 0;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid
    ${hasError ? theme.colors.red800 : theme.colors.semantic.borderDefault};
  background: transparent;
  outline: none;
  &::placeholder {
    color: ${hasError ? theme.colors.red1000 : theme.colors.gray400};
  }
`;

const Login = () => {
  const theme = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const from = state?.from?.pathName ?? '/';
  const { login } = useAuth();
  const {
    id,
    pw,
    setId,
    setPw,
    touchedId,
    touchedPw,
    setTouchedId,
    setTouchedPw,
    isValidId,
    isValidPw,
    idError,
    pwError,
  } = useLoginForm();

  const handleLogin = async () => {
    if (isValidId && isValidPw) {
      try {
        const response = await axios.post('/api/login', {
          email: id,
          password: pw,
        });
        const token = response.data.data.authToken;
        localStorage.setItem('authToken', token);
        toast.success('로그인 성공!');
        const userInfo = response.data.data;
        login(userInfo);
        navigate(from, { replace: true });
      } catch (error: unknown) {
        const axiousError = error as AxiosError<{ message?: string }>;
        if (
          axiousError.response &&
          axiousError.response.status >= 400 &&
          axiousError.response.status < 500
        ) {
          toast.error(
            axiousError.response.data.message || '로그인에 실패했습니다.'
          );
        } else {
          toast.error('서버 오류가 발생했습니다.');
        }
      }
    } else {
      setTouchedId(true);
      setTouchedPw(true);
    }
  };

  return (
    <div css={logContainer(theme)}>
      <h2 style={{ textAlign: 'center' }}>KaKao</h2>

      <input
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
        onBlur={() => setTouchedId(true)}
        css={logStyle(theme, touchedId && !isValidId)}
      />
      {touchedId && idError && (
        <div style={{ color: theme.colors.red800, fontSize: 12, marginTop: 4 }}>
          {idError}
        </div>
      )}

      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        onBlur={() => setTouchedPw(true)}
        css={logStyle(theme, touchedPw && !isValidPw)}
      />
      {touchedPw && pwError && (
        <div style={{ color: theme.colors.red800, fontSize: 12, marginTop: 4 }}>
          {pwError}
        </div>
      )}

      <Button
        onClick={handleLogin}
        baseColor={theme.colors.semantic.kakaoYellow}
        textColor="black"
      >
        로그인
      </Button>
    </div>
  );
};

export default Login;

