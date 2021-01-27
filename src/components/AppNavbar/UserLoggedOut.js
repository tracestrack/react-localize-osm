import LoadingButton from "../common/LoadingButton";

export default function UserLoggedOut({login, loading}) {
    return (
        <LoadingButton 
            title="login"
            loading={loading}
            onClick={login}
        />
    );
}
