import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import { Album, AlbumDocument } from "../schemas/album.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateAlbumDto } from "./create-album.dto";

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

    @Post()
    @UseInterceptors(
      FileInterceptor('image', {dest: './public/uploads/albums'})
    )
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() albumData: CreateAlbumDto
    ) {
        const album = new this.albumModel({
            name: albumData.name,
            isPublished: albumData.isPublished,
            artist: albumData.artist,
            date: albumData.date,
            image: file ? '/uploads/albums/' + file.filename : null,
        });

        return album.save();
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const deletedAlbum = await this.albumModel.findByIdAndDelete(id);
        if (!deletedAlbum) {
            throw new NotFoundException('No such album');
        }
        return deletedAlbum;
    }
}
