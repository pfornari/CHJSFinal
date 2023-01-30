async function cargaCotizacion() {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ARS")
    const datos = await response.json()
    valorDolar = datos.rates.ARS
}

class Credito{
    asignarCredito(usuario, correo, capital, tasa, plazo) {
        const infoCredito={
            usuario: usuario,
            correo: correo,
            capital: capital,
            tasa: tasa,
            plazo: plazo,
            cotiza: valorDolar
        }
        this.guardarCredito(infoCredito);
    }

    guardarCredito(infoCredito){
        let nCredito;
        nCredito=this.obtenerCredito();
        nCredito.push(infoCredito);
        localStorage.setItem('nCredito', JSON.stringify(nCredito));
    }

    obtenerCredito(){
        let creditoLS;
        if (localStorage.getItem('nCredito')==null){
            creditoLS=[];
        }
        else {
            creditoLS=JSON.parse(localStorage.getItem('nCredito'));
        }
        return creditoLS;
    }

    calcularCuota(capital, tasa, plazo){
        let totalInteres = 0;
        let totalCapital = 0;
        let saldoEnDolares = 0;
        let parte1 = (Math.pow(1+tasa/100, plazo)*tasa/100);
        let parte2 = (Math.pow(1+tasa/100, plazo)-1);
        let cuota = capital * parte1 / parte2;
        
        while(tblCalculo.rows.length > 1) {
            tblCalculo.deleteRow(1);
        }
        while(tblResultado.rows.length > 1) {
            tblResultado.deleteRow(1);
        }
        this.limpiaResultado;
        for(let desde = 1; desde <= plazo; desde++){
            totalInteres = parseFloat(capital*(tasa/100));
            totalCapital = cuota-totalInteres;
            capital = parseFloat(capital-totalCapital);
            saldoEnDolares = capital / valorDolar;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${desde}</td>
                <td>${cuota.toFixed(2)}</td>
                <td>${totalCapital.toFixed(2)}</td>
                <td>${totalInteres.toFixed(2)}</td>
                <td>${capital.toFixed(2)}</td>
                <td>${saldoEnDolares.toFixed(2)}</td>                
            `;
            tblCalculo.appendChild(row)
        }
        tblCalculo.style.visibility = 'visible';
        nombre.value = "";
        correo.value = "";
        capital.value = "";
        tasa.value = "";
        plazo.value = "";        
    }

    mostrarUsuarios(e){
        e.preventDefault();
        let creditoLS = JSON.parse(localStorage.getItem('nCredito'));
        if (creditoLS==null){
            Swal.fire('No hay datos cargados')
        }
        else {
            while(tblResultado.rows.length > 1) {
                tblResultado.deleteRow(1);
            }        
            creditoLS.forEach(credito => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${credito.usuario}</td>
                <td>${credito.correo}</td>
                <td>${credito.capital}</td>
                <td>${credito.tasa}</td>
                <td>${credito.plazo}</td>
            `;
            tblResultado.appendChild(row);
            })
            tblResultado.style.visibility = 'visible';
        }
    }

    limpiaResultado(){
        tblResultado.style.visibility = 'hidden';
    }

    limpiaCalculo(){
        tblCalculo.style.visibility = 'hidden';
    }

    limpiaTodo(){
        this.limpiaCalculo;
        this.limpiaResultado;
        nombre.value = "";
        correo.value = "";
        capital.value = "";
        tasa.value = "";
        plazo.value = "";
    }

    verificar(e){
        e.preventDefault();
        let usuario = document.getElementById('nombre').value;
        let correo = document.getElementById('correo').value;
        let capital = document.getElementById('capital').value;
        let tasa = document.getElementById('tasa').value;
        let plazo = document.getElementById('plazo').value;
        if (usuario=='' || correo=='' || capital=='' || tasa=='' || plazo==''){
             Swal.fire('Por favor, ingresar todos los datos requeridos');
        }
        else {
            creditoNuevo.asignarCredito(usuario, correo, capital, tasa, plazo);
            creditoNuevo.calcularCuota(capital, tasa, plazo);
        }
    }
}
let valorDolar = 0;
cargaCotizacion();

let tblCalculo = document.getElementById('tblCalculo');
tblCalculo.style.visibility = 'hidden';
let tblResultado = document.getElementById('tblResultado');
tblResultado.style.visibility = 'hidden';

let creditoNuevo=new Credito();

let btnCalcular = document.getElementById('calcular').addEventListener('click',creditoNuevo.verificar);
let btnMostrar = document.getElementById('mostrar').addEventListener('click', creditoNuevo.mostrarUsuarios);
let btnLimpiar = document.getElementById('limpiar').addEventListener('click', creditoNuevo.limpiaTodo);