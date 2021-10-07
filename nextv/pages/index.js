import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import fire from "../config/fire-config"
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from "react-player"
import VideoPlayer from 'react-native-web-video/Video';

export default function Home() {
  
  

  const getBase64FromUrl = async (url) => {
    console.log(url)

    const data = await fetch(url,{method:"get", "access-control-allow-origin" : "*",});
    const blob = await data.blob();
    console.log(blob)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
      // setImgSel(prev=>[...prev,base64data])
          setVideos(prev=>[...prev,base64data])
           resolve(base64data);

          //Abrindo a transação com a object store "contato"
            var transaction = db.transaction('name', "readwrite");

            // Quando a transação é executada com sucesso
            transaction.oncomplete = function(event) {
                console.log('Transação finalizada com sucesso.');
            };

            // Quando ocorre algum erro na transação
            transaction.onerror = function(event) {
                console.log('Transação finalizada com erro. Erro: ' + event.target.error);
            };

            //Recuperando a object store para incluir os registros
            var store = transaction.objectStore('name');

                var request = store.add(base64data,url);

                //quando ocorrer um erro ao adicionar o registro
                request.onerror = function (event) {
                    console.log('Ocorreu um erro ao salvar o contato.');
                }

                //quando o registro for incluido com sucesso
                request.onsuccess = function (event) {
                    console.log('Contato salvo com sucesso.');
                }
            
      }
    });
  }




const [videos,setVideos] = useState([]);
const [src,setSrc] = useState([]);

var db;



useEffect(()=>{
    if(typeof window !== undefined){
      console.log("entrou aqui")
      console.log("indexou")
      var request = window.indexedDB.open("DBteste",2);
      request.onsuccess = async function (event) { 
            db = event.target.result;
            
              var transaction = db.transaction('name', "readwrite");
            
            
              //Recuperando a object store para incluir os registros
           var store = await transaction.objectStore('name').getAll();

              store.onsuccess = function(e){
                setVideos(store.result)
                setSrc(store.result[0]);
              }
               /*  let vidArray = []
              var todos = await transaction.objectStore('name').openCursor();
              todos.onsuccess = function(event){
                  let cursor = event.target.result;
                  if (cursor) {
                      vidArray.push({[cursor.primaryKey]:cursor.value});

                    cursor.continue();
                  }else{
                    setVideos(vidArray);
                    
                    setSrc(vidArray[0][Object.keys(vidArray[0])[0]]);
                  
                  }

               }*/
                
       }
       

      

       window.addEventListener('offline', () => {
  
          console.log('Became offline');
        
          var transaction = db.transaction('name', "readwrite");
        
        
          //Recuperando a object store para incluir os registros
          var store = transaction.objectStore('name').getAll();
          store.onsuccess = function(e){
            
            console.log(store.result)
          }
        
          
        });
    
        request.onerror = function (event) { 
            //erro ao criar/abrir o banco de dados
        }
        
        request.onupgradeneeded = function(event) {
              console.log("here")
                var  db = event.target.result;        
                var store3 = db.createObjectStore("name", { autoIncrement: true });

            }
    }
},[])


var upLoad = false;


useEffect(()=>{
  if(window.navigator.onLine){
  const doc = fire.firestore().collection('listvideos');
  doc.onSnapshot((docSnapshot) => {

     let arrayVideos = [];
    docSnapshot.forEach((async x=>{
        console.log(x.id)
        const url = "https://btgnews.com.br/videos/"+x.id+"?to=crop&r=256";
        arrayVideos.push(url);
       
    }))

    upLoad = true;
    if(db){
          console.log("db on!!!")
          var transaction = db.transaction('name', "readwrite");

          var todos = transaction.objectStore('name').openCursor();
            todos.onsuccess = function(event){
                let cursor = event.target.result;
                if (cursor) {
                    let key = cursor.primaryKey;
                    if(arrayVideos.includes(key)){
                      console.log('TEEEM')
                    }else{
                      console.log("NÃÃÃÃO!")
                      console.log(key)
                      var store = transaction.objectStore('name').delete(key);

                      store.onsuccess = function(event){
                          var v = transaction.objectStore('name').getAll();
                          v.onsuccess = function(e){
                            
                            setVideos(v.result)
                            setSrc(v.result[0]);
                          }
                      }

                    }
                    /*let value = cursor.value;
                    console.log(key, value);*/
                    cursor.continue();
                }
            }

            arrayVideos.forEach(url=>{
              var store = transaction.objectStore('name').get(url);

                store.onsuccess = async function(){
                          if(store.result == undefined){
                            const src = await getBase64FromUrl(url);
                          }else{
                            console.log("xxxx")
                          }
                }
                store.onerror = function(){
                          console.log("deu erro")
                }
            })

        }else{
          console.log("DB OFF, TÁ VENDO!")
        }


      }, err => {
        console.log(`Encountered error: ${err}`);
      },

    );
  
}


},[])


useEffect(()=>{
  if(window.navigator.onLine){
  const doc = fire.firestore().collection('live').doc("on");


 doc.onSnapshot(
  (docSnapshot) => {

        if(docSnapshot.data().link){
          setSrc(docSnapshot.data().link)
        }
  }, err => {
    console.log(`Encountered error: ${err}`);
  },

  );
}
},[])

const[index,setIndex] = useState(0);
const myCallback = () => {
  console.log('Video has ended')

  setIndex(index+1);

  if(index+1 >= videos.length){
    setIndex(0);
    setSrc(videos[0]);


  }else{
    setSrc(videos[index+1]);

  }
  //ref.current.parentElement.play()
}

const ref = useRef();
const CallFace = () => {
  setTimeout(Mudo,8000)
}
function Mudo(){
  console.log(ref)
  console.log(ref.current.player)
  console.log(ref.current.player.player)
  
  ref.current.player.player.unmute()
  ref.current.player.handlePlay()

}

const Video = () => {
  return(
    <VideoPlayer source={{uri: src}}   // Can be a URL or a local file.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       rate={1.0}                              // 0 is paused, 1 is normal.
       volume={1.0}                            // 0 is muted, 1 is normal.
       muted={false}                           // Mutes the audio entirely.
       paused={false}                          // Pauses playback entirely.
       resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
       repeat={true}                           // Repeat forever.
       playInBackground={false}                // Audio continues to play when app entering background.
       playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
       ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
       progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
       onLoadStart={this.loadStart}            // Callback when video starts to load
       onLoad={this.setDuration}               // Callback when video loads
       onProgress={this.setTime}               // Callback every ~250ms with currentTime
       onEnd={this.onEnd}                      // Callback when playback finishes
       onError={this.videoError}               // Callback when video cannot be loaded
       onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onTimedMetadata={this.onTimedMetadata}  />
  )
}

const Video2 = () =>{
  return(
    <ReactPlayer
        url={src}
        onEnded={() => myCallback()}
        onReady={()=>CallFace()}
        controls
        muted
        playing
        ref={ref}
      />
   
  )
}

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
      <Video/>
     </div>
  )
}
