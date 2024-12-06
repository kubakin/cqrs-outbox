"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OutboxDatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxDatabaseModule = exports.OutboxDatabaseService = exports.entities = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const outbox_entity_1 = require("./outbox.entity");
exports.entities = [outbox_entity_1.Message];
let OutboxDatabaseService = class OutboxDatabaseService {
    constructor() { }
    async onModuleInit() {
        this.dataSource = new typeorm_1.DataSource({
            type: 'postgres',
            entities: exports.entities,
            entityPrefix: `${this.options.name}_`,
            namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
            migrationsRun: true,
            logging: false,
            synchronize: true,
            applicationName: `${this.options.name}_outbox`,
            name: 'outbox',
            host: this.options.dbOptions.host,
            port: this.options.dbOptions.port,
            database: this.options.dbOptions.database,
            username: this.options.dbOptions.username,
            password: this.options.dbOptions.password,
        });
        try {
            if (!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
            }
        }
        catch (error) {
            console.error(error?.message);
        }
        if (!this.dataSource.isInitialized)
            throw new Error('DataSource is not initialized');
    }
    async onModuleDestroy() {
        await this.dataSource.destroy();
    }
};
__decorate([
    (0, common_1.Inject)('OPTIONS'),
    __metadata("design:type", Object)
], OutboxDatabaseService.prototype, "options", void 0);
OutboxDatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OutboxDatabaseService);
exports.OutboxDatabaseService = OutboxDatabaseService;
let OutboxDatabaseModule = OutboxDatabaseModule_1 = class OutboxDatabaseModule {
    static async forRoot(options) {
        return {
            module: OutboxDatabaseModule_1,
            providers: [
                OutboxDatabaseService,
                { provide: 'OPTIONS', useValue: options },
            ],
            exports: [OutboxDatabaseService],
        };
    }
};
OutboxDatabaseModule = OutboxDatabaseModule_1 = __decorate([
    (0, common_1.Module)({})
], OutboxDatabaseModule);
exports.OutboxDatabaseModule = OutboxDatabaseModule;
//# sourceMappingURL=outbox-datasource.js.map