import { Document, Model, MongooseBaseQueryOptions, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<T> {
    constructor(protected model: Model<T>) {
    }

    async create(item: T): Promise<T & Document> {
        const doc = new this.model(item);
        return await doc.save() as unknown as T & Document;
    }

    async exist(
        filter: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ) {
        return await this.model.findOne(filter, projection, options);
    }
    async findById(
        filter: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ) {
        return await this.model.findById(filter, projection, options);
    }

    async getAll(
        filter: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ) {
        return await this.model.find(filter, projection, options);
    }

    async update(
        filter: RootFilterQuery<T>,
        update: UpdateQuery<T>,
        options?: MongooseUpdateQueryOptions<T>
    ) {
        return await this.model.updateOne(filter, update, options);
    }
    
    async findByIdAndUpdate(
        filter: RootFilterQuery<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>
    ) {
        return await this.model.findByIdAndUpdate(filter, update, options);
    }
    
    async delete(
        filter: RootFilterQuery<T>,
        options?: MongooseBaseQueryOptions<T>
    ) {
        return await this.model.deleteOne(filter, options);
    }
     async deleteMany(
        filter: RootFilterQuery<T>,
        options?: MongooseBaseQueryOptions<T>
    ) {
        return await this.model.deleteMany(filter, options);
    }
}