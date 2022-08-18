import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // We need to create an async function to ensure that vbefore any test is executed
  // the promise is resolved
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
      // We can use automatic change detetcion with some boundaries because synchronous changes are
      // not detected
      // providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    })
      .compileComponents()
      .then(() => {
        // Test utility type that is going to help us to do some common test operations such
        // as f.e.: obtaining an instance of a component, debugging the component etc.
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        // Test utility in order to be able to query the DOM
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    // We pass some data to the component
    component.courses = setupCourses();
    // If we look at the DOM it is empty
    // console.log(el.nativeElement.outerHTML);
    // We need to update the DOM to display the cards
    fixture.detectChanges();
    // Now the DOM is not empty
    // console.log(el.nativeElement.outerHTML);
    const cards = el.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });

  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    // We query the first child with the selector
    const card = el.query(By.css(".course-card:first-child"));
    // Inside the card we query the title
    const title = card.query(By.css("mat-card-title"));
    const image = card.query(By.css("img"));

    // We check that the card exists
    expect(card).toBeTruthy();
    // We check that the contentn of the title is the expected one
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});
