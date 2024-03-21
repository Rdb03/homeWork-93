import {Controller, Get, NotFoundException, Param, Query} from '@nestjs/common';
import {Album, AlbumDocument} from "../schemas/album.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Controller('albums')
export class AlbumsController {
    constructor(
        @InjectModel(Album.name)
        private albumModel: Model<AlbumDocument>,
    ) {}

    @Get()
    async getAll(@Query('artistId') artistId: string) {
        if (!artistId) {
            return this.albumModel.find().populate('artist', 'name');
        } else {
            return this.albumModel.find({artist: {_id: artistId}}).populate('artist', 'name');
        }
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        const artist = this.albumModel.findById(id);
        if(!artist) {
            throw new NotFoundException('No such artist');
        }

        return artist;
    }
}
