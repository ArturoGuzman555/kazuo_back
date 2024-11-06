import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class Migrations1730907187782 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'auth0Id',
            type: 'varchar',
            isUnique: true,
            isNullable: true, // Permite valores nulos inicialmente para evitar problemas con registros existentes.
        }));

        // Opcional: Si deseas que 'auth0Id' sea obligatorio y no tenga valores nulos, puedes actualizar los registros existentes
        // para asignarles un valor predeterminado antes de configurar la columna como no nula.
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'auth0Id');
    }
}
