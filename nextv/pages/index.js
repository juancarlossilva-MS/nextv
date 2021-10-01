import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import fire from "../config/fire-config"
import { useEffect, useState } from 'react';

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
                console.log(store)
                console.log(store.result)
                setVideos(store.result)
              }
            
          

       }

      

       window.addEventListener('offline', () => {
  
          console.log('Became offline');
        
          var transaction = db.transaction('name', "readwrite");
        
        
          //Recuperando a object store para incluir os registros
          var store = transaction.objectStore('name').getAll();
        
          console.log(store.result)
        
          
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


 doc.onSnapshot(

  
   
  (docSnapshot) => {

    console.log("snapshot")
  


    console.log("init clear");
    console.log(upLoad);

    /*if(db !== undefined && upLoad){
          setVideos([]);
          console.log('db está definido')
          var transaction = db.transaction('name', "readwrite");
          var store = transaction.objectStore('name').clear();
    }*/

     

    console.log("end clear");
    //pegar o array do docChanges e pra cada um gerar a KEY == URL+x.id  e excluir do banco o valor informado pelo firestore
    docSnapshot.docChanges.forEach(async change=>{
      
      if(change.type == "removed"){
        const url = "http://btgnews.com.br/videos/"+change.doc.id+"?to=crop&r=256";
        console.log(url)
        var transaction = db.transaction('name', "readwrite");
        //Recuperando a object store para incluir os registros
        var store = transaction.objectStore('name').delete(url);

        store.onsuccess = function(event){
          var todos = transaction.objectStore('name').getAll();
            todos.onsuccess = function(event){
                  setVideos(todos.result)
            }
        }
      }

    })



    docSnapshot.forEach((async x=>{
        console.log(x.id)
        const url = "http://btgnews.com.br/videos/"+x.id+"?to=crop&r=256";

        var transaction = db.transaction('name', "readwrite");
      
      
        //Recuperando a object store para incluir os registros
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
      
      
        
         console.log(videos)
        //  console.log(src)
        //setVideos(src);
    }))

    upLoad = true;



  }, err => {
    console.log(`Encountered error: ${err}`);
  },

  
  
  );
}


},[])

function Imagens(){
  return( videos.map(u => {
        if(u[5] == "v"){
          return(
                <video loop="true" autoPlay="autoplay" controls muted>
                  <source src={u} type="video/mp4"/>
                </video>
            )
          }else{

            return(<img src={u}/>)
          }
      })
  )
}

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <Imagens/>
    
     </div>
  )
}
