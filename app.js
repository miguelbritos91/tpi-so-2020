new Vue({
    el: '#app',
    data: {
        titulo: 'TPI SO 2020 - Grupo 11',
        fileProcesosLoad: true,
        fileProcesos: [],
        fileProcesosOrderTA: [],
        lista_arribo: [], //json de procesos que van arriando en el tiempo, se ordenan con criterio SJF
        cola_listos: [],  //cola de procesos en estado de listo, si un proceso esta listo implica que este cargado en memoria!
        partSO: 100,
        part1: 60,
        part2: 120,
        part3: 250,
        MEM: [],
        excec: false,
        clock: 0,
        CPU: null,
        status: {},
        status_clock: [],
        estadistica: []
    },
    methods: {
        cargarProcesos(event){
            const procesos = event.target.files[0]
            let fr = new FileReader();
            fr.onload = e => {
                const result = JSON.parse(e.target.result);
                this.fileProcesos = result
                this.fileProcesosLoad = false
                console.log(this.fileProcesos);
            }
            fr.readAsText(procesos);
        },
        inicializar_variables(){
            this.lista_arribo = [] 
            this.cola_listos = []  
        
            this.MEM = [
                {
                    particion: 1,
                    tipo: 'Sitema Operativo',
                    size: this.partSO,
                    inicio:0
                },
                {
                    particion: 2,
                    tipo: 'Procesos',
                    size: this.part1,
                    asignado: false,
                    idproceso: null,
                    fragmentacion: 0,
                    inicio:100
                },
                {
                    particion: 3,
                    tipo: 'Procesos',
                    size: this.part2,
                    asignado: false,
                    idproceso: null,
                    fragmentacion: 0,
                    inicio:160
                },
                {
                    particion: 4,
                    tipo: 'Procesos',
                    size: this.part3,
                    asignado: false,
                    idproceso: null,
                    fragmentacion: 0,
                    inicio:280
                }
            ]

            this.estadistica = [
                {
                    clock: 0,
                    cola_listos: [
                        {
                            id: 0,
                            part: 0,
                            size: 0,
                            ta: 0,
                            ti: 0
                        }
                    ],
                    cpu: {
                        id: 0,
                        part: 0,
                        size: 0,
                        ta: 0,
                        ti: 0
                    },
                    memoria: [],
                    proc_nuevos: [
                        {
                            id: 0,
                            part: 0,
                            size: 0,
                            ta: 0,
                            ti: 0
                        }
                    ]
                }
            ]
        },
        ordernarProcesosTA(){
            this.fileProcesos.map(item => {
                const elto = {
                    id: item.id,
                    ta: item.ta,
                    ti: item.ti,
                    size: item.size
                }
                this.fileProcesosOrderTA.push(elto)
            })
            this.fileProcesosOrderTA = this.fileProcesosOrderTA.sort((a, b) => a.ta - b.ta)
            console.log(this.fileProcesosOrderTA);
        },
        async iniciarSimulacion(){
            console.log('inicializando variables...');
            await this.inicializar_variables()
            console.log('ordeno la lista de procesos por TA');
            await this.ordernarProcesosTA()
            console.log('iniciar simulacion');
            console.log('corriendo algoritmo de simulacion');
            await this.simulador()
            console.log('-------------------------FIN---------------------------');
            console.log(this.status_clock);
            await this.finSimulacion(this.status_clock)
            this.excec = true
        },
        async cargarEnMemoria(proc,part){
            let proc_listo = Object.assign({}, proc)
            proc_listo.part = part
            let memoria = Object.assign({}, this.MEM[part])
            memoria.asignado =  true
            memoria.idproceso = proc.id
            memoria.fragmentacion = memoria.size - proc_listo.size
            this.MEM[part] = await Object.assign({}, memoria)
            console.log('Se cargo en memoria PR:',proc_listo.id,' - MEM:',memoria);
            await this.cola_listos.push(proc_listo)
            this.cola_listos = this.cola_listos.sort((a, b) => a.ti - b.ti)
            this.lista_arribo.shift()
        },
        liberarMemoria(part) {
            this.MEM[part].asignado = false
            this.MEM[part].idproceso = null
            this.MEM[part].fragmentacion = 0
        },
        tratarCPU() {
            console.log('Tratar CPU:');
            this.CPU.ti--
            console.log('PR:', this.CPU.id,'- TI(',this.CPU.ti,')');
            if(this.CPU.ti===0){
                console.log('Proceso Finalizado:',this.CPU.id);
                this.liberarMemoria(this.CPU.part)
                this.CPU = null
            }
        },
        async simulador(){
            while(this.fileProcesosOrderTA.length > 0 || this.lista_arribo.length > 0 || this.cola_listos.length > 0 || this.CPU != null){
                console.log('---------------CLOCK: ',this.clock,'------------------');

                this.status.clock = this.clock


                // CONTROL DE PROCESOS NUEVOS START
                const arribos = Object.assign([], this.fileProcesosOrderTA.filter(proc => proc.ta === this.clock))
                arribos.map(item => {
                    // ALMACENAR PROCESOS QUE VAN ARRIBANDO
                    this.lista_arribo.push(item)
                    this.lista_arribo = this.lista_arribo.sort((a, b) => a.ti - b.ti)   // Cuando inserta un nuevo proceso hacemos un ordenamiento por TI menor (SJF)
                    console.log('clock:',this.clock,'PROCESO:',item.id);
                    this.fileProcesosOrderTA.shift()
                })

                this.status.proc_nuevos = Object.assign([], this.lista_arribo)
                // CONTROL DE PROCESOS NUEVOS END


                // CONTROL DE PROCESOS EN MEMORIA START
                    // ASIGNACION DE MEMORIA ALGORITMO BEST-FIT

                for (let i = 0; i < 3; i++) {
                    if(this.lista_arribo.length > 0){
                        if(!this.MEM[1].asignado && this.lista_arribo[0].size <= this.part1){
                            console.log('entro en part 1');
                            await this.cargarEnMemoria(this.lista_arribo[0],1)
                        }else if(!this.MEM[2].asignado && this.lista_arribo[0].size <= this.part2){
                            console.log('entro en part 2');
                            await this.cargarEnMemoria(this.lista_arribo[0],2)
                        }else if (!this.MEM[3].asignado && this.lista_arribo[0].size <= this.part3){
                            console.log('entro en part 3');
                            await this.cargarEnMemoria(this.lista_arribo[0],3)
                        }
                    }
                }
                                
                // CONTROL DE PROCESOS EN MEMORIA END


                if(!this.CPU){
                    this.CPU = await Object.assign({}, this.cola_listos[0])
                    this.cola_listos.shift()
                    this.tratarCPU()
                    console.log('CPU:', this.CPU);
                }else{
                    this.tratarCPU()
                    this.status.cpu = null
                }
                
                let mem_aux = []
                for (let i = 1; i < this.MEM.length; i++) {
                    let item = Object.assign({}, this.MEM[i])
                    mem_aux.push(item)
                }
                this.status.memoria = mem_aux
                this.status.cpu = Object.assign({}, this.CPU)
                this.status.cola_listos = Object.assign([], this.cola_listos)
                this.status_clock.push(Object.assign({}, this.status))

                this.clock++
            }
        },
        finSimulacion(resultado){
            const res_fin = Object.assign([], resultado)
            this.estadistica = res_fin
        },
        reset(){
            this.inicializar_variables()
            this.fileProcesosLoad= true,
            this.fileProcesos= [],
            this.fileProcesosOrderTA= [],
            this.excec= false,
            this.clock= 0,
            this.CPU= null
            this.status = {}
            this.status_clock = []
        }
    }
})