import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema()
export class Artist {
    @Prop({required: true})
    name: string;

    @Prop()
    image: string;

    @Prop()
    info: string;

    @Prop({required: true, default: false})
    isPublished: boolean;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

export type ArtistDocument = Artist & Document;