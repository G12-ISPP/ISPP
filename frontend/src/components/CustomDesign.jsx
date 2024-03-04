import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Stage, PresentationControls, Html, useProgress } from '@react-three/drei';
import { MeshStandardMaterial, Color, Vector3 } from 'three';
import './CustomDesign.css';
import Button, { BUTTON_TYPES } from './Button/Button';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

const calculateAreaVolumeAndDimensions = (bufferGeometry) => {
  let volume = 0;
  let area = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;

  const positionAttribute = bufferGeometry.attributes.position;
  const vertex = new Vector3();
  const vertexNext1 = new Vector3();
  const vertexNext2 = new Vector3();
  const crossProduct = new Vector3();

  for (let i = 0; i < positionAttribute.count; i += 3) {
    vertex.fromBufferAttribute(positionAttribute, i);
    vertexNext1.fromBufferAttribute(positionAttribute, i + 1);
    vertexNext2.fromBufferAttribute(positionAttribute, i + 2);

    updateMinMax(vertex);
    updateMinMax(vertexNext1);
    updateMinMax(vertexNext2);

    const edge1 = vertexNext1.clone().sub(vertex);
    const edge2 = vertexNext2.clone().sub(vertex);
    crossProduct.crossVectors(edge1, edge2);
    const triangleArea = crossProduct.length() / 2;
    area += triangleArea;

    volume += vertex.dot(crossProduct) / 6;
  }
  volume = Math.abs(volume);

  function updateMinMax(vertex) {
    minX = Math.min(minX, vertex.x);
    maxX = Math.max(maxX, vertex.x);
    minY = Math.min(minY, vertex.y);
    maxY = Math.max(maxY, vertex.y);
    minZ = Math.min(minZ, vertex.z);
    maxZ = Math.max(maxZ, vertex.z);
  }

  const dimensions = {
    width: maxX - minX,
    height: maxY - minY,
    depth: maxZ - minZ,
  };

  return { volume, area, dimensions };
};


function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

function Model({ url, volumeAndArea }) {
  const geometry = useLoader(STLLoader, url);
  const data = calculateAreaVolumeAndDimensions(geometry);
  volumeAndArea(data);
  const material = new MeshStandardMaterial({ color: new Color("skyblue"), metalness: 0.8, roughness: 0.8 });

  const maxDimension = Math.max(data.dimensions.width, data.dimensions.height, data.dimensions.depth);
  const maxAllowedDimension = 40;
  const scale = maxDimension > maxAllowedDimension ? maxAllowedDimension / maxDimension : 1;

  const rotation = [-Math.PI / 2, 0, 0];

  return (
    <mesh geometry={geometry} material={material} scale={[scale, scale, scale]} rotation={rotation} />
  );
}

const PRICE_PER_CM3 = {
  Bajo: 0.15,
  Medio: 0.20,
  Alto: 0.25,
}

export default class CustomModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: '',
      volume: 0,
      area: 0,
      dimensions: { width: 0, height: 0, depth: 0 },
      weight: 0,
      quality: 'Bajo',
      quantity: 1,
      price: 0,
      modelUrl: '/bd_a_001.STL',
      postal_code: 1,
      city: '',
      address: '',
      buyer_mail: '',
      errors:{}
    };
  }

  async componentDidMount() {
        
    try {

      let petition = backend + '/designs/loguedUser';
        petition = petition.replace(/"/g, '');
        const response = await fetch(petition, {
          headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
      });
      const datos = await response.json();
      this.state.buyer_mail = datos.email;
      this.state.postal_code = datos.postal_code;
      this.state.city = datos.city;
      this.state.address = datos.address;
        
    } catch (error) {
        console.log(error);
    }
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (fileExtension !== 'stl') {
      alert('El archivo no es de formato STL. Por lo tanto lo ignoraremos. Por favor, sube un archivo STL.');
      event.target.value = ''; 
      return;
    }else{
      const url = URL.createObjectURL(file);
      this.setState({ modelUrl: url, file: file });
    }
    
  }

  calculatePrice = (volume, quality) => {
    return (PRICE_PER_CM3[quality] * volume).toFixed(2);
  }

  updatePriceBasedOnQuantity = () => {
    const { volume, quality, quantity } = this.state;
    let pricePerUnit = this.calculatePrice(volume, quality);
    // 3 euros para nosotros, 3 para el impresor y 2 para el envío por cada pieza
    let totalPrice = (pricePerUnit+8) * quantity ;
    totalPrice = Math.max(totalPrice, 12.10);
    this.setState({ price: totalPrice.toFixed(2) });
  };

  handleAreaAndVolume = (data) => {
    const maxDimension = Math.max(data.dimensions.width, data.dimensions.height, data.dimensions.depth);
    const maxAllowedDimension = 40;
    const scale = maxDimension > maxAllowedDimension ? maxAllowedDimension / maxDimension : 1;
    const density = 1.25;
    const weight = data.volume * scale ** 3 * density;

    const adjustedDimensions = {
      width: (data.dimensions.width * scale).toFixed(2),
      height: (data.dimensions.height * scale).toFixed(2),
      depth: (data.dimensions.depth * scale).toFixed(2),
    };

    this.setState({
      volume: (data.volume * scale ** 3).toFixed(2),
      area: (data.area * scale ** 2).toFixed(2),
      dimensions: adjustedDimensions,
      weight: weight.toFixed(2),
    }, this.updatePriceBasedOnQuantity);
  };

  handleName = (event) => {
    this.setState({ name: event.target.value });
  }

  handleQuality = (value) => {
    this.setState({ quality: value }, this.updatePriceBasedOnQuantity);
  }

  handleQuantity = (event) => {
    const quantity = Math.max(1, Number(event.target.value));
    this.setState({ quantity: quantity }, this.updatePriceBasedOnQuantity);
  }

  handlePostalCode = (event) => {
    this.setState({ postal_code: event.target.value });
  }

  handleCity = (event) => {
    this.setState({ city: event.target.value });
  }

  handleAddress = (event) => {
    this.setState({ address: event.target.value });
  }

  handleBuyerMail = (event) => {
    this.setState({ buyer_mail: event.target.value });
  }

  handleKeyDown = (event) => {
    if (event.key === ',')
      event.preventDefault();
  }

  handlePayment = async () => {
    const { file, name, volume, area, dimensions, weight, quality, quantity, price, postal_code, city, address, buyer_mail } = this.state;
    this.state.errors = {};
    if (!file) {
      this.state.errors.file = 'Debes subir un archivo';
    }
    if (name === '' || name.length >255) {
      this.state.errors.name = 'Debes introducir un nombre de menos de 255 caracteres';
    }
    if(quantity < 1 || quantity > 100 || quantity!=Math.round(quantity)){
      this.state.errors.quantity = 'La cantidad debe ser un número entre 1 y 100';
    }

    if(typeof postal_code === 'undefined'||postal_code < 1000 || postal_code > 52999 || postal_code===Math.round(postal_code)){
      this.state.errors.postal_code = 'El código postal debe ser un número entero entre 1000 y 52999';
    }

    if(typeof city==='undefined' ||city === '' || city.length > 50){
      this.state.errors.city = 'Debes introducir una ciudad de menos de 255 caracteres';
    }

    if(typeof address==='undefined' ||address === '' || address.length > 255){
      this.state.errors.address = 'Debes introducir una dirección de menos de 255 caracteres';
    }

    if(typeof buyer_mail === 'undefined' ||buyer_mail === '' || buyer_mail.length > 255){
      this.state.errors.buyer_mail = 'Debes introducir un correo de menos de 255 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyer_mail)) {
      this.state.errors.buyer_mail = 'Debes introducir un correo válido';
    }

    

    if (Object.keys(this.state.errors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify({
      name,
      volume,
      area,
      dimensions,
      weight,
      quality,
      quantity,
      price,
      postal_code,
      city,
      address,
      buyer_mail
    }));

    try {
      let petition = backend + '/designs/my-design';
      petition = petition.replace(/"/g, '')
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(petition, {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (response.ok) {
        const responseData = await response.json();
        const paypalPaymentUrl = responseData.paypal_payment_url; 
        window.location.href = paypalPaymentUrl;
      } else {
        alert('Error al enviar los datos')
      }
    } catch (error) {
      alert('Error al enviar los datos');
    }
  };

  render() {
    return (
      <>
        <h1 className='title'>Mi diseño</h1>
        <div className='main'>
          <div className='canvas-container'>
            <Canvas dpr={[1, 2]} className='canvas' shadows camera={{ fov: 45 }} style={{ display: "flex", width: "500px", height: "300px", marginBottom: "50px", borderRadius: "15px", touchAction: "none" }}>
              <Suspense fallback={<Loader />}>
                <color attach="background" args={["#101010"]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <PresentationControls speed={1.5} global zoom={1.5} polar={[-0.1, Math.PI / 4]}>
                  <Stage environment={"sunset"} adjustCamera={true} key={this.state.modelUrl} scale={0.01}>
                    <Model url={this.state.modelUrl} volumeAndArea={this.handleAreaAndVolume} />
                  </Stage>
                </PresentationControls>
              </Suspense>
            </Canvas>
          </div>
          <form className='form'>
            <div className='form-group'>
              <label htmlFor="file" className='upload'> Sube tu diseño:</label>
              <div className='file-select'>
                <input type='file' id='file' name='file' className='form-input' accept='.stl' onChange={this.handleFileChange} />
                {this.state.errors.file && <div className="error">{this.state.errors.file}</div>}
              </div>
            </div>
            <div className='form-group'>
              <label className='name'>Nombre:</label>
              <input type='text' id='name' name='name' className='form-input' onChange={this.handleName} />
              {this.state.errors.name && <div className="error">{this.state.errors.name}</div>}
            </div>
            <div className='form-group'>
              <label className='quantity'>Cantidad:</label>
              <input type='number' id='quantity' name='quantity' className='form-input' min={1} max={100} onChange={this.handleQuantity} value={this.state.quantity} onKeyDown={this.handleKeyDown} />
              {this.state.errors.quantity && <div className="error">{this.state.errors.quantity}</div>}
            </div>
            <div className='form-group'>
              <label className='quality'>Calidad:</label>
              <input type='button' id='low' name='quality'  className='fat-btn' value='Bajo' onClick={() => this.handleQuality('Bajo')} />
              <input type='button' id='medium' name='quality' className='fat-btn' value='Medio' onClick={() => this.handleQuality('Medio')} />
              <input type='button' id='high' name='quality' className='fat-btn' value='Alto' onClick={() => this.handleQuality('Alto')} />
            </div>
            <div className='form-group'>
              <label className='postal_code'>Código Postal:</label>
              <input type='number' id='postal_code' name='postal_code' className='form-input' min={1000} max={52999} value={this.state.postal_code} onChange={this.handlePostalCode} />
              {this.state.errors.postal_code && <div className="error">{this.state.errors.postal_code}</div>}
            </div>
            <div className='form-group'>
              <label className='city'>Ciudad:</label>
              <input type='text' id='city' name='city' className='form-input' value={this.state.city} onChange={this.handleCity} />
              {this.state.errors.city && <div className="error">{this.state.errors.city}</div>}
            </div>
            <div className='form-group'>
              <label className='address'>Dirección:</label>
              <input type='text' id='address' name='address' className='form-input' value={this.state.address} onChange={this.handleAddress} />
              {this.state.errors.address && <div className="error">{this.state.errors.address}</div>}
            </div>
            <div className='form-group'>
              <label className='buyer_mail'>Correo electrónico:</label>
              <input type='text' id='buyer_mail' name='buyer_mail' className='form-input' value={this.state.buyer_mail} onChange={this.handleBuyerMail} />
              {this.state.errors.buyer_mail && <div className="error">{this.state.errors.buyer_mail}</div>}
            </div>
          </form>
        </div>
        <div className='summary'>
          <div className='summary-content'>
            <h2>Resumen</h2>
            <h3>Dimensiones: {this.state.dimensions.width}cm x {this.state.dimensions.height}cm x {this.state.dimensions.depth}cm</h3>
            <h3>Área/Volumen: {this.state.area}cm²/ {this.state.volume}cm³ </h3>
            <h3>Peso: {this.state.weight}g</h3>
            <h3>Calidad: {this.state.quality}</h3>
            <h3>Precio: <span>{this.state.price}€ (IVA y gastos de envío incluidos)</span></h3>
          </div>
          <Button type={BUTTON_TYPES.LARGE} text='Pagar' onClick={this.handlePayment} />
        </div>
      </>
    );
  }
}