import appPreviewImg from '../assets/app_nlw_preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users_avatar_example.png'
import Image from 'next/image'
import iconImg from '../assets/icon.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pool', {
        title: poolTitle
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)
      alert(
        'Bolão criado com sucesso, o código foi transferido para a área de transferencia!'
      )

      setPoolTitle('')
    } catch (err) {
      alert('Faha ao criar o Bolão, tente novamente!')
    }
  }

  return (
    <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="NLW Copa"></Image>

        <h1 className="text-white mt-14 text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt=""></Image>
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form className="mt-10 flex gap-2" onSubmit={createPool}>
          <input
            type="text"
            placeholder="Qual o nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-ignite-500 hover:text-gray-100 transition-colors"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconImg} alt=""></Image>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">{props.poolCount}</span>
              <span>Bolões Criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconImg} alt=""></Image>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">{props.guessCount}</span>
              <span>Palpites registrados!</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      ></Image>
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('pool/count'),
      api.get('guess/count'),
      api.get('user/count')
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}
