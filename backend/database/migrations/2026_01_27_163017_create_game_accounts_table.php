<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('game_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('game_name');
            $table->string('whatsapp'); // تم التعديل هنا لحفظ رقم الواتساب
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->enum('status', ['available', 'sold'])->default('available');
            $table->json('images')->nullable();
            $table->integer('likes_count')->default(0);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_accounts');
    }
};