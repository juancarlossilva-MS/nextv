import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import fire from "../config/fire-config"
import { useEffect, useRef, useState } from 'react';
import {List, TextField,Button, InputLabel, ListItem } from '@mui/material';

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
const flexContainer = {
  flexDirection: 'row',
  padding: 0,
  
};
const LinkLive = () =>{
  return(<div >
          <InputLabel >Link da Transmissao ao vivo</InputLabel>
          <InputLabel>obs: deixe vazio para offline</InputLabel>
        
        <TextField id="outlined-basic"  onChange={e => setLink(e.target.value) } value={link}  fullWidth label="Link Live" variant="standard" />
        <Button onClick={salvarLive}>Salvar</Button>
     </div>)
}

const VideosLista = () =>{
  return(<div>
    <List style={flexContainer}>
    {videos.map(x => {
      
      return(
       
        <ListItem key={x.id}>
            
                      <video key={x.id} width={300} controls height={300}><source type="video/mp4" src={"https://btgnews.com.br/videos/"+x.id+"?to=crop&r=256"} /> </video>
                      <ul>
                      {locais.map(l => {
                        return(
                                <li key={l}>{l} - {x.data()[l] !== undefined && "SELECTED"  }</li>
                                )
                                
                              })}
                      </ul>
                     

                      
          </ListItem>)
        })}
        </List>
   </div>)
}

  return (
    <div className={styles.container}>
      <div style={{height: `200px`,
            overflow: "scroll",}}>

         <LinkLive/>
      </div>
      <div>

         <VideosLista/>
      </div>
     
     </div>
  )
}
