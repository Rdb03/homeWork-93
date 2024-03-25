import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getAll(@Query('albumId') albumId: string) {
    if (!albumId) {
      return this.trackModel.find().populate('album', 'name');
    } else {
      return this.trackModel
        .find({
          album: { _id: albumId },
        })
        .sort({ number: 1 })
        .populate({
          path: 'album',
          select: 'name',
          model: 'Album',
          populate: {
            path: 'artist',
            select: 'name',
            model: 'Artist',
          },
        });
    }
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() trackData: CreateTrackDto) {
    try {
      const track = new this.trackModel({
        name: trackData.name,
        number: trackData.number,
        duration: trackData.duration,
        album: trackData.album,
        isPublished: trackData.isPublished,
      });

      await track.save();

      return track;
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(e);
      }

      throw e;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedArtist = await this.trackModel.findByIdAndDelete(id);
    if (!deletedArtist) {
      throw new NotFoundException('No such artist');
    }
    return deletedArtist;
  }
}
