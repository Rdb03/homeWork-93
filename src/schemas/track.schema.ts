import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Album } from './album.schema';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Track {
  @Prop({ required: true })
  name: string;

  @Prop({ ref: Album.name, required: true })
  album: mongoose.Schema.Types.ObjectId;

  @Prop()
  duration: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true, default: false })
  isPublished: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

export type TrackDocument = Track & Document;
