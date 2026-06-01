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
        Schema::create('activity_log', function (Blueprint $table) {
            $table->id();
           // اسم السجل (مثلاً: "user_created", "order_updated") 
            $table->string('log_name')->nullable(); // وصف العملية 
            $table->text('description')->nullable(); // الكيان اللي وقع عليه الحدث (مثلاً: user, order, game_account) 
            $table->unsignedBigInteger('subject_id')->nullable(); 
            $table->string('subject_type')->nullable(); // الشخص اللي دار العملية (مثلاً: admin) 
            $table->unsignedBigInteger('causer_id')->nullable();
            $table->string('causer_type')->nullable();     
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_log');
    }
};
