import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import fire from "../config/fire-config"
import { useEffect, useRef, useState } from 'react';
import {List, FormGroup,Grid,FormControlLabel,Checkbox, TextField,Button, InputLabel, ListItem, Typography } from '@mui/material';
import ReactDOM from 'react-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Home() {
  
  
  const [open, setOpen] = useState(false);
  const [id, setID] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

   function BasicModal() {
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
             Certeza que deseja deletar? {id}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
  


const [videos,setVideos] = useState([]);
const [src,setSrc] = useState([]);


var upLoad = false;


useEffect(()=>{
  const doc = fire.firestore().collection('listvideos');
  let arrayVideos = [];
  doc.onSnapshot((docSnapshot) => {

    docSnapshot.forEach(async x=>{
        
        const url = "https://btgnews.tv.br/videos/"+x.id+"?to=crop&r=256";
        arrayVideos.push(x);
       
    })
    setVideos(arrayVideos)

  })
},[])

const [locais,setLocais] = useState([]);


useEffect(()=>{
  const doc = fire.firestore().collection('locais');
  let arrayLocais = [];
  doc.get().then((docSnapshot) => {

    docSnapshot.forEach(async x=>{
       
       
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
  const result = (fire.firestore().collection("live").doc("on").update({link:link}))
  result.then(alert("SUCESSO"));
  
}
function salvarVideos(){
   videosL.map( video=>{
    Object.keys(video).map( key=>{
      const local = video[key]
       fire.firestore().collection("listvideos").doc(key).update({[local]:""})
    })
  })
}
const flexContainer = {
  flexDirection: 'row',
  padding: 0,
  
};
const[checks,setChecks] = useState([]);

function selecLocal(event){
  if(event.target.checked){

    setChecks((prev) => [...prev,event.target.name])
  }else{
    setChecks(s=>s.filter(s=>s!==event.target.name))
  }

}

function deletarLocais(){
  console.log(checks)
  checks.map(x=>{
       fire.firestore().collection("locais").doc(x).delete().then(() => {
          console.log("Document successfully deleted!");
          setLocais(s => s.filter(s=> s !== x))
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });

  })
  setChecks([]);
}

const[novoL,setNovoL] = useState("")

function cadastrarLocal(){
  
  const result = (fire.firestore().collection("locais").doc(novoL).set({}))

  setLocais(prev => [...prev,novoL]);
  setNovoL("");
  
}

const[videosL,setVideosL] = useState([])
function selecVideoLocal(event){

    if(event.target.checked){
  
      setVideosL((prev) => [...prev,{[event.target.id]:event.target.name}])
    }else{
      let arrayVideosL = []
    videosL.map(video=>{
          Object.keys(video).map(key=>{
              if(event.target.id != key || event.target.name != video[key]) 
              arrayVideosL.push(video)
          })
      })

      setVideosL(arrayVideosL)

    }
}
const videoref = useRef()
function addVideo(){
  //criar um nome aleatorio pro video e enviar junto e buscar la $_post[name]
  const crypto = require("crypto");
  const videoName = crypto.randomBytes(12).toString("hex")
  let data = new FormData();
  data.append('file', videoref.current.files[0]);
  data.append('name', videoName);
  let resul = fetch("https://btgnews.tv.br/videos/upload.php",{
      method: "POST",
      body: data,
      responseText: "true",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      header:{
        "access-control-allow-origin":"*",
        "Content-Type": "multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD"
      }
      })
  resul.then(async x=>
   { 

    if(x.ok){
      await fire.firestore().collection("listvideos").doc(videoName).set({});
        window.location.reload()
      x.json().then((responseData) => {
        console.log(responseData);
        
      })}
    }
  )


}

function deletarVideo(e){
  setID(e.target.id)
  handleOpen()
}

const bordas = {
  borderWidth: "6px",borderStyle: "dashed",borderColor: "#f00"
}
const margem = {marginLeft:10,padding:10,borderWidth: "6px",borderStyle: "dashed",borderColor: "#f00"}

  return (
    <div style={{padding:30}}>
      <Grid container spacing={5}>
            <Grid item xs={5} >
              <div style={margem}>
                <InputLabel >Link da Transmissao ao vivo</InputLabel>
                <InputLabel>obs: deixe vazio para offline</InputLabel>
              
              <TextField id="outlined-basic"  onChange={e => setLink(e.target.value) } value={link}  fullWidth label="Link Live" variant="standard" />
              <div style={{paddingTop:10}}>
                  <Button   variant="contained" color="success" onClick={salvarLive}>Salvar Live</Button>
              </div> 
              </div> 
          </Grid>
          <Grid item xs={7} >
            <div style={margem}>
                <Typography variant="h6"> Locais de tranmissão</Typography>
                        <FormGroup style={{maxHeight:250}}>
                                {locais.map(l => {
                                  
                                      
                                  return(
                                                                                
                                    <FormControlLabel key={l}  control={<Checkbox name={l} onChange={selecLocal}  />} label={l} />
                                              
                                    )
                            })}
                        <div>
                        <TextField variant="standard" fullWidth onChange={e=>setNovoL(e.target.value)} value={novoL} label="Digite aqui o nome do Novo Local"></TextField><br/>
                        <Button   variant="contained" color="success" onClick={cadastrarLocal}>Cadastrar novo Local</Button>
                        </div>
                        {checks.length > 0 &&

                              <Button   variant="contained" color="error" onClick={deletarLocais}>Deletar locais selecionados</Button>
                        }
         
                        </FormGroup>
              </div>
          </Grid>
    </Grid>
    <Grid item xs={6} style={{marginTop:20}}>
       <div style={margem}>
          <Typography variant="h6">Lista de Videos</Typography>
          <input type="file" ref={videoref}/>
          <Button onClick={addVideo} variant="contained" color="warning">Adicionar novo video!</Button>
        </div>
      </Grid>
    <Grid container style={{marginTop:30}}>
        
              {videos.map(x => {
                
                return(
                 <Grid item x={2} key={x.id} style={margem} >
                      <Button  variant="contained" id={x.id} onClick={e=>deletarVideo(e)} color="error">Deletar</Button>

                  <ListItem >
                        <video width={250} controls height={250}><source type="video/mp4" src={"https://btgnews.tv.br/videos/"+x.id+"?to=crop&r=256"} /> </video>
                        <FormGroup>
                        {locais.map(l => {
                          
                              if( x.data()[l] !== undefined){
                                return(
                                  <FormControlLabel key={l} control={<Checkbox name={l} id={x.id} onChange={selecVideoLocal}  defaultChecked  />} label={l} />
                              )
                              }else{
                                    return(
                                                                        
                                      <FormControlLabel key={l}  control={<Checkbox  name={l} id={x.id} onChange={selecVideoLocal}  />} label={l} />
                                      
                                        )
                              }
                                })}
                        </FormGroup>
                              

                                
                    </ListItem>
                  </Grid> 
                    
                    )
                  })}
                  
      </Grid>    
      <div style={{padding:30}}>
        
      <Button   variant="contained" color="success" onClick={salvarVideos}>Salvar Videos</Button>

      </div>             
      <BasicModal />
     </div>
  )
}
