import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Stage, PresentationControls, Html, useProgress } from '@react-three/drei';
import { MeshStandardMaterial, Color, Vector3 } from 'three';
import './CustomDesign.css';

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
      postal_code: '',
      city: '',
      address: '',
      buyer_mail: ''
    };
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
    let totalPrice = (pricePerUnit+6) * quantity ;
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

  handleKeyDown = (event) => {
    if (event.key === ',')
      event.preventDefault();
  }

  handlePayment = async () => {
    const { file, name, volume, area, dimensions, weight, quality, quantity, price, postal_code, city, address, buyer_mail } = this.state;

    if (!file) {
      alert('Debes subir un archivo');
      return;
    }
    if (name === '' && name.length >255) {
      alert('Debes introducir un nombre de menos de 255 caracteres');
      return;
    }

    if (postal_code === '' || city === '' || address === '') {
      alert('Debes completar todos los campos de dirección');
      return;
    }

    if(postal_code.length !== 5){
      alert('El código postal debe tener 5 dígitos');
      return;
    }

    if (buyer_mail === ''){
      alert('Debes introducir un correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyer_mail)) {
      alert('El correo electrónico ingresado no es válido');
      return;
    }

    if(buyer_mail.length>255){
      alert('El correo electrónico debe tener menos de 255 caracteres');
      return;
    }

    if(city.length> 50){
      alert('La ciudad debe tener menos de 50 caracteres');
      return;
    }

    if(address.length>255){
      alert('La dirección debe tener menos de 255 caracteres');
      return;
    }

    if(quantity >100){
      alert('La cantidad máxima es 100');
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
      const response = await fetch(`http://127.0.0.1:8000/designs/my-design`, {
        method: 'POST',
        body: formData,
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
                <input type='file' id='file' name='file' accept='.stl' onChange={this.handleFileChange} />
              </div>
            </div>
            <div className='form-group'>
              <label className='name'>Nombre:</label>
              <input type='text' id='name' name='name' onChange={this.handleName} />
            </div>
            <div className='form-group'>
              <label className='quantity'>Cantidad:</label>
              <input type='number' id='quantity' name='quantity' min={1} max={100} onChange={this.handleQuantity} value={this.state.quantity} onKeyDown={this.handleKeyDown} />
            </div>
            <div className='form-group'>
              <label className='quality'>Calidad:</label>
              <input type='button' id='low' name='quality' value='Bajo' onClick={() => this.handleQuality('Bajo')} />
              <input type='button' id='medium' name='quality' value='Medio' onClick={() => this.handleQuality('Medio')} />
              <input type='button' id='high' name='quality' value='Alto' onClick={() => this.handleQuality('Alto')} />
            </div>
            <div className='form-group'>
              <label className='postal_code'>Código Postal:</label>
              <input type='text' id='postal_code' name='postal_code' onChange={(event) => this.setState({ postal_code: event.target.value })} />
            </div>
            <div className='form-group'>
              <label className='city'>Ciudad:</label>
              <input type='text' id='city' name='city' onChange={(event) => this.setState({ city: event.target.value })} />
            </div>
            <div className='form-group'>
              <label className='address'>Dirección:</label>
              <input type='text' id='address' name='address' onChange={(event) => this.setState({ address: event.target.value })} />
            </div>
            <div className='form-group'>
              <label className='buyer_mail'>Correo electrónico:</label>
              <input type='text' id='buyer_mail' name='buyer_mail' onChange={(event) => this.setState({ buyer_mail: event.target.value })} />
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
            <h3>Precio: <span>{this.state.price}€ (IVA incluido)</span></h3>
          </div>
          <input className='buy' type='button' id='buy' name='buy' value='Pagar' onClick={this.handlePayment} />
        </div>
      </>
    );
  }
}