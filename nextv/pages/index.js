import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import fire from "../config/fire-config"
import { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button, InputLabel } from '@mui/material';

export default function Home() {
  
  


const [videos,setVideos] = useState([]);
const [src,setSrc] = useState([]);


var upLoad = false;


useEffect(()=>{
  const doc = fire.firestore().collection('listvideos');
  let arrayVideos = [];
  doc.onSnapshot((docSnapshot) => {

    docSnapshot.forEach(async x=>{
        console.log(x.id)
        const url = "https://btgnews.com.br/videos/"+x.id+"?to=crop&r=256";
        arrayVideos.push(x);
       
    })
    setVideos(arrayVideos)

  })
},[])

const [locais,setLocais] = useState([]);


useEffect(()=>{
  const doc = fire.firestore().collection('locais');
  let arrayLocais = [];
  doc.onSnapshot((docSnapshot) => {

    docSnapshot.forEach(async x=>{
        console.log(x.id)
       
        arrayLocais.push(x.id);
       
    })
    setLocais(arrayLocais)

  })
},[])

const[link,setLink] = useState("");
useEffect(()=>{
  if(window.navigator.onLine){
  const doc = fire.firestore().collection('live').doc("on");


 doc.onSnapshot(
  (docSnapshot) => {

        if(docSnapshot.data().link){
          setLink(docSnapshot.data().link)
        }
  }, err => {
    console.log(`Encountered error: ${err}`);
  },

  );
}
},[])
function salvarLive(){
  console.log(link)
}

  return (
    <div className={styles.container}>
      <body>
      <InputLabel >Link da Transmissao ao vivo</InputLabel>
      <InputLabel>obs: deixe vazio para offline</InputLabel>
     <TextField id="outlined-basic"  onChange={e => setLink(e.target.value) } value={link}  fullWidth label="Link Live" variant="standard" />
     <Button onClick={salvarLive}>Salvar</Button>
     <div>
        <ul>
      {videos.map(x => {
        
        return(
         
          <li>

                        <video key={x.id} width={300} controls autoPlay height={300}><source type="video/mp4" src={"https://btgnews.com.br/videos/"+x.id+"?to=crop&r=256"} /> </video>
                        <ul>
                        {locais.map(l => {
                          return(
                                  <li>{l} - {x.data()[l] !== undefined && "SELECTED"  }</li>
                                  )
                                  
                                })}
                        </ul>
                       

                        
            </li>)
            
            
            
          })}
          </ul>
     </div>
     </body>
     </div>
  )
}
