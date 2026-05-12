import { 
  ArgumentsHost, 
  Catch, 
  ExceptionFilter, 
  HttpException, 
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";

@Catch()
@Injectable()
export class AllException implements ExceptionFilter {
    constructor(private readonly prisma: PrismaService) {}

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Verificamos el status
        const status = exception instanceof HttpException 
            ? exception.getStatus() 
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // Extraemos el mensaje
        const message = exception instanceof HttpException 
            ? exception.getResponse() 
            : 'Internal server error';

        const errorString = typeof message === 'string' ? message : (message as any).message || message;
        const finalErrorString = Array.isArray(errorString) ? errorString.join(', ') : String(errorString);
        const errorCodeString = String(exception.code || 'UNKNOWN_ERROR');

        // Extraer sesion_id del token desencriptado alojado en request.user (si existe)
        const sesionId = request.user?.id ? Number(request.user.id) : null;

        // FIX: Guardar el log en la base de datos antes de regresar el response
        try {
            await this.prisma.logs.create({
                data: {
                    statusCode: status,
                    timeStamp: new Date(),
                    path: request.url,
                    error: finalErrorString,
                    errorCode: errorCodeString,
                    sesion_id: Number.isNaN(sesionId) ? null : sesionId,
                }
            });
        } catch (e) {
            console.error("No se pudo guardar el error en los logs de DB", e);
        }

        // Enviamos la respuesta estructurada
        response.status(status).json({
            statusCode: status,
            timeStamp: new Date().toISOString(),
            path: request.url,
            error: finalErrorString,
            errorCode: errorCodeString
        });
    }
}