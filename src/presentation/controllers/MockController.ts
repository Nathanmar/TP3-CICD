import { Request, Response } from 'express';
import { SchemaFormatHandler } from '../../application/validation/SchemaFormatHandler.js';
import { MaxLimitHandler } from '../../application/validation/MaxLimitHandler.js';
import { TypeSupportedHandler } from '../../application/validation/TypeSupportedHandler.js';
import { MockDataBuilder } from '../../domain/builders/MockDataBuilder.js';
import { StringGenerator } from '../../domain/strategies/StringGenerator.js';
import { NumberGenerator } from '../../domain/strategies/NumberGenerator.js';
import { UUIDGenerator } from '../../domain/strategies/UUIDGenerator.js';
import { NameGenerator } from '../../domain/strategies/NameGenerator.js';

export class MockController {
    private validationChain: SchemaFormatHandler;
    private strategyMap: Record<string, any> = {
        string: StringGenerator,
        number: NumberGenerator,
        uuid: UUIDGenerator,
        name: NameGenerator,
    };

    constructor() {
        this.validationChain = new SchemaFormatHandler();
        this.validationChain
            .setNext(new MaxLimitHandler())
            .setNext(new TypeSupportedHandler());
    }

    handleMockRequest = (req: Request, res: Response) => {
        const error = this.validationChain.handle(req.body);
        if (error) {
            return res.status(400).json({ error });
        }

        const { schema, count } = req.body;
        const builder = new MockDataBuilder();

        for (const field in schema) {
            const type = schema[field].toLowerCase();
            const StrategyClass = this.strategyMap[type];
            builder.addField(field, new StrategyClass());
        }

        const data = builder.buildMany(count);
        res.json(data);
    };
}
