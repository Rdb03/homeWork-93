import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import { Model } from "mongoose";
import { Artist, ArtistDocument } from "../schemas/artist.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateArtistDto } from "./create-artist.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('artists')
export class ArtistsController {
    constructor(
      @InjectModel(Artist.name)
      private artistModel: Model<ArtistDocument>,
    ) {
    }

    @Get()
    getAll() {
        return this.artistModel.find();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        const artist = this.artistModel.findById(id);
        if (!artist) {
            throw new NotFoundException('No such artist');
        }

        return artist;
    }

    @Post()
    @UseInterceptors(
      FileInterceptor('image', { dest: './public/uploads/artists' })
    )
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() artistData: CreateArtistDto
    ) {
        const artist = new this.artistModel({
            name: artistData.name,
            isPublished: artistData.isPublished,
            info: artistData.info,
            image: file ? '/uploads/artists/' + file.filename : null,
        });

        return artist.save();
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const deletedArtist = await this.artistModel.findByIdAndDelete(id);
        if (!deletedArtist) {
            throw new NotFoundException('No such artist');
        }
        return deletedArtist;
    }
}

