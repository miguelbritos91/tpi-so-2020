new Vue({
    el: '#app',
    data: {
        titulo: 'TPI SO 2020 - Grupo 11',
        fileProcesos: [],
        lista_arribo: [], //json de procesos que van arriando en el tiempo, se ordenan con criterio SJF
        cola_listos: [],  //cola de procesos en estado de listo, si un proceso esta listo implica que este cargado en memoria!
        partSO: 100,
        part1: 60,
        part2: 120,
        part3: 250,
        MEM: [],
        excec: false
    },
    methods: {
        iniciarSimulacion(){
            console.log('inicializando variables...');
            this.inicializar_variables()
            console.log('iniciar simulacion');
            this.excec = true
        },
        cargarProcesos(event){
            const procesos = event.target.files[0]
            let fr = new FileReader();
            fr.onload = e => {
                const result = JSON.parse(e.target.result);
                this.fileProcesos = result
                console.log(this.fileProcesos);
            }
            fr.readAsText(procesos);
        },
        inicializar_variables(){
            this.lista_arribo = [] 
            this.cola_listos = []  
        
            this.MEM = [
                {
                    "particion": 1,
                    "tipo": 'Sitema Operativo',
                    "tamaño": this.partSO,
                    "inicio":0
                },
                {
                    "particion": 2,
                    "tipo": 'Procesos',
                    "tamaño": this.part1,
                    "asignado": false,
                    "idproceso": null,
                    "fragmentacion": 0,
                    "inicio":100
                },
                {
                    "particion": 3,
                    "tipo": 'Procesos',
                    "tamaño": this.part2,
                    "asignado": false,
                    "idproceso": null,
                    "fragmentacion": 0,
                    "inicio":160
                },
                {
                    "particion": 4,
                    "tipo": 'Procesos',
                    "tamaño": this.part3,
                    "asignado": false,
                    "idproceso": null,
                    "fragmentacion": 0,
                    "inicio":280
                }
            ]
        }
    },
    mounted() {
        this.inicializar_variables()
    },
  })


// archivoProcesos.addEventListener('change', (e) => {
//     fileProcesos = e.target.files[0];
//     console.log(fileProcesos)
//     let lector = new FileReader();
//     lector.onload = function(e) {
//         let contenido = e.target.result;
//         procesosCargados = JSON.parse(contenido)
//     };
//     lector.readAsText(fileProcesos);
//     printTableProcess(procesosCargados)
// })

// function printTableProcess(proc){
//     let tablaProcesos = document.getElementById('tablaProcesos')
//     for (let i = 0; i < proc.length; i++) {
//         tablaProcesos.innerHTML += `<tr>
//                             <th scope="row">${proc[i].id}</th>
//                             <td>${proc[i].ta}</td>
//                             <td>${proc[i].ti}</td>
//                             <td>${proc[i].size}</td>
//                         </tr>`
//     }
//     console.log(tablaProcesos);
// }

// submitFile.addEventListener('click', (e)=>{
//     e.preventDefault()
    
//     console.log(procesosCargados)
//     console.log('cargar archivo');
// })