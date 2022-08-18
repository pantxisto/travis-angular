import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(waitForAsync(() => {
    // We create a mock service with the findAllCourses method
    let coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      // We need the NoopAnimationsModule because the coursesModule does not have
      // the animationsModule and when clicking the tabs would break
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    // We mock the response of the service method
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    // We mock the response of the service method
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    // We mock the response of the service method
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });

  it("should display advanced courses when tab clicked - jasmine done()", (done: DoneFn) => {
    // We mock the response of the service method
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // This click triggers RequestAnimationFrame API
    click(tabs[1]);

    console.log(tabs[1].nativeElement.textContent);

    fixture.detectChanges();

    setTimeout(() => {
      const cardTitles = el.queryAll(
        By.css(".mat-tab-body-active .mat-card-title")
      );

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course - Web Security Fundamentals"
      );
      done();
    });
  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    // We mock the response of the service method
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // This click triggers RequestAnimationFrame API
    click(tabs[1]);

    console.log(tabs[1].nativeElement.textContent);

    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(
      By.css(".mat-tab-body-active .mat-card-title")
    );

    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course - Web Security Fundamentals"
    );
  }));

  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    // We mock the response of the service method
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // This click triggers RequestAnimationFrame API
    click(tabs[1]);

    console.log(tabs[1].nativeElement.textContent);

    fixture.detectChanges();

    // This is the callback the waitForAsync test zone is going to call whenever all the  asynchronous
    // operations that the test zone has detected inside the code that is wrapping are completed
    fixture.whenStable().then(() => {
      console.log("Called whenStable");

      const cardTitles = el.queryAll(
        By.css(".mat-tab-body-active .mat-card-title")
      );

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course - Web Security Fundamentals"
      );
    });
  }));
});
