<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'name' => $this->faker->sentence(3),
            'slug' => $this->faker->slug,
            'description' => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(10),
            'images' => 'storage/images_project/default.jpg',
            'link_project' => $this->faker->url,
            'github_project' => $this->faker->url,
        ];
    }
}
