# Trabajo Practico Integrador - Sistemas Operativos 2020
## Simulador de Asignación de Memoria y Planificación de procesos

***
### Integrantes:
* Britos, Miguel
* Caraves, Arturo
* Lencinas, Pablo Agustin
* Maidana, Fatima
* Martinez Sebastian

***

### Objetivo:
Este proyecto tiene como objetivo la implementación de un simulador que permita mostrar los aspectos de la Planificación de Procesos a Corto Plazo y la gestión de la memoria con particiones Fijas dentro de un esquema de un solo procesador, tratando el ciclo de vida completo de un proceso desde su ingreso al sistema hasta su finalización.

### Funcionamiento:
El programa permite el ingreso de **n** procesos cargados previamente en un arreglo de objetos por medio de una estructura de datos JSON. Por cada proceso se debe ingresar el Id de proceso, tamaño del proceso, tiempo de arribo y tiempo de irrupción, a continuacion se detalla el formato aceptado de dicha estructura: 
```
[
    {
        "id": number|string,
        "ta":number,
        "ti":number,
        "size":number
    },
    ...
]
```

La política de asignación de memoria es por medio del algoritmo Best-Fit.
La planificación de CPU será dirigida por un algoritmo SJF.

El simulador está disponible para hacer pruebas, para ello dirijase al siguiente sitio donde se encuentra online: https://miguelbritos91.github.io/tpi-so-2020/

* Para facilitar las pruebas dejamos disponible para su descarga el siguiente archivo con formato JSON de un ejemplo de procesos a ejecutar por el simulador: https://miguelbritos91.github.io/tpi-so-2020/proc.json
