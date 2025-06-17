import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ProductGateway {
    @WebSocketServer()
    server: Server;

    emitNewProduct(product: any) {
        this.server.emit('new_product', product);
    }
}
