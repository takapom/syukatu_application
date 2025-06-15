type Props = {
  auth: () => void
}

export default function Logout({ auth }: Props) {
    return(
        <div>
            <button onClick={auth}>ログアウト</button>
        </div>
    )
}