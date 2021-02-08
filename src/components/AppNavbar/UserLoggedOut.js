import LoadingButton from "../common/LoadingButton";

export default function UserLoggedOut({login, loading}) {
    return (
        <LoadingButton 
            title="Login"
            loading={loading}
            onClick={login}
        />
    );
}
