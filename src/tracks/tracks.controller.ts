import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Track, TrackDocument } from "../schemas/track.schema";
import { Model } from "mongoose";
import { CreateTrackDto } from "./create-track.dto";

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
      return this.trackModel.find({
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
          }
        });
    }
  }

  @Post()
  async create(
    @Body() trackData: CreateTrackDto) {
    const track = new this.trackModel({
      name: trackData.name,
      number: trackData.number,
      duration: trackData.duration,
      album: trackData.album,
      isPublished: trackData.isPublished,
    });

    return track.save();
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
