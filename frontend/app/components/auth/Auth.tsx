'use client'
import { useEffect, useState } from 'react'
import styles from './Auth.module.css'
import { redirect } from 'next/navigation'
import { useAppContext } from '@/app/context/app.context'
import { Htag } from '../common/htag/Htag'
import { Input } from '../common/input/input'
import { Message } from '../common/message/message'
import { loginToApp } from '@/app/service/common/loginToApp'
import { showMessage } from '@/app/service/common/showMessage'
import ReCAPTCHA from 'react-google-recaptcha'
import { setTodayToInterval } from '@/app/service/reports/setTodayToInterval'
import { BodyForLogin, dashboardUsersList, workersUsersList } from '@/app/interfaces/user.interface'
import useSWR from 'swr'
import { getDataForSwr } from '@/app/service/common/getDataForSwr'

const defaultBody: BodyForLogin = {
  email: '',
  password: ''
}

export default function Auth() {
  
  const {mainData, setMainData} = useAppContext();
  const { user } = mainData.users
  const [body, setBody] = useState<BodyForLogin>(defaultBody)
  const [capVal, setCapVal] = useState<boolean>(true);

  const changeElements = (e: React.FormEvent<HTMLInputElement>) => {
      let target = e.currentTarget
      setBody(state => {
          return {
              ...state,
              [target.id]: target.value
          }
      })
  }

  const onSubmit = (body: BodyForLogin, setMainData: Function | undefined) => {
    const {email, password} = body;
    if (email.trim().length && password.trim().length) {
      loginToApp(body, setMainData )
    } else {
      showMessage("Кириш учун маълумотларни киритинг", 'error', setMainData)
    }
  }
  
  useEffect(() => {
    const {user} = mainData.users
    
    if (user != undefined) {
      if (dashboardUsersList.includes(user?.role)) {
        redirect('/dashboard')
      } else if (workersUsersList.includes(user?.role)) {
        redirect('/workers')
      } else {
        redirect('/')
      }
    }

  }, [user])

  const changeVal = () => {
    setCapVal(val => !val)
  }

  useEffect(()=> {
    setTodayToInterval(setMainData);
  }, [])

  return (
    <>
        <div className={styles.container}>
            <div className={styles.content}>
            <Htag tag='h1'>Дастурга кириш</Htag>
            <Htag tag='h3'>{`Иштихон тумани 'Шавкат Нон' хусусий корхонасида ишлаб чикариш ва савдо фаолиятини автоматизация килувчи веб-дастур`}</Htag>
            <Input value={body.email} placeholder='Email' label='' id='email' onChange={(e)=>changeElements(e)}/>
            <Input value={body.password} placeholder='Password' type='password' label='' id='password' onChange={(e)=>changeElements(e)}/>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY ? process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY : ' '}
              onChange={() => changeVal()}
            />
            <button 
              disabled={capVal}
              className={styles.button} 
              // appearance='primary' 
              onClick={() => onSubmit(body, setMainData)}>
                Кириш
              </button>
            </div>
        </div>
        <Message/>
    </>
      
  )
}
