// import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
// import { StoreService } from '../modules/store/store.service';
// import { ProductService } from '../modules/product/product.service';

// @WebSocketGateway()
// export class WebsocketGateway {
//   constructor(
//     private readonly storeService: StoreService,
//     private readonly productService: ProductService,
//   ) {}

//   @SubscribeMessage('getStores')
//   async handleGetStores(@ConnectedSocket() client: Socket) {
//     const stores = await this.storeService.findAll();
//     client.emit('storesUpdate', stores);
//   }

//   @SubscribeMessage('addStore')
//   async handleAddStore(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//     const newStore = await this.storeService.create(data);
//     const stores = await this.storeService.findAll();
//     client.broadcast.emit('storesUpdate', stores);
//     client.emit('storesUpdate', stores);
//   }

//   @SubscribeMessage('deleteStore')
//   async handleDeleteStore(@MessageBody() storeId: string, @ConnectedSocket() client: Socket) {
//     await this.storeService.remove(storeId);
//     const stores = await this.storeService.findAll();
//     client.broadcast.emit('storesUpdate', stores);
//     client.emit('storesUpdate', stores);
//   }

//   @SubscribeMessage('getProducts')
//   async handleGetProducts(@MessageBody() storeId: string, @ConnectedSocket() client: Socket) {
//     const products = await this.productService.findAllByStore(storeId);
//     client.emit('productsUpdate', products);
//   }

//   @SubscribeMessage('addProduct')
//   async handleAddProduct(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//     const newProduct = await this.productService.create(data);
//     const products = await this.productService.findAllByStore(data.storeId);
//     client.broadcast.emit('productsUpdate', products);
//     client.emit('productsUpdate', products);
//   }

//   @SubscribeMessage('deleteProduct')
//   async handleDeleteProduct(@MessageBody() productId: string, @ConnectedSocket() client: Socket) {
//     const product = await this.productService.findOne(productId);
//     await this.productService.remove(productId);
//     const products = await this.productService.findAllByStore(product.storeId);
//     client.broadcast.emit('productsUpdate', products);
//     client.emit('productsUpdate', products);
//   }
// }